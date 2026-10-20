// Online features for the GitHub version of MushtaqTrack.
//
// The game's online parts (community tracks, leaderboards, ghosts, names, live
// races and chat) were written for the Claude artifact runtime and reach it
// through window.claude.use('db'), use('user') and use('room'). This file
// provides those same three things on top of Firebase, so the game itself is
// unchanged:
//   db   - shared documents, in Cloud Firestore
//   user - a player id for each browser, from Firebase anonymous sign-in
//   room - live rooms (who's here and what they're doing), in the Realtime Database
// Only the parts of those interfaces the game uses are here. With no settings
// in online-config.js this file does nothing and the game is single-player.
(function () {
  'use strict';
  const cfg = window.MUSHTAQ_ONLINE;
  if (!cfg || !cfg.firebase || !cfg.firebase.projectId) return;

  const SDK = 'https://www.gstatic.com/firebasejs/10.14.1/';
  const load = file => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SDK + file; s.onload = resolve; s.onerror = () => reject(new Error('Could not load ' + file));
    document.head.appendChild(s);
  });
  const timeout = (p, ms) => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase did not answer')), ms))]);
  const ready = timeout(load('firebase-app-compat.js')
    .then(() => Promise.all(['firebase-auth-compat.js', 'firebase-firestore-compat.js', 'firebase-database-compat.js'].map(load)))
    .then(start), 60000)
    .catch(e => { console.warn('MushtaqTrack: the online features are off.', e); return {}; });
  window.claude = Object.freeze({ use: name => ready.then(api => api[name] || null) });

  async function start() {
    firebase.initializeApp(cfg.firebase);
    const auth = firebase.auth(), fs = firebase.firestore(), rtdb = firebase.database();
    if (cfg.emulators) { // local testing with the Firebase emulators
      auth.useEmulator('http://127.0.0.1:9099'); fs.useEmulator('127.0.0.1', 8080); rtdb.useEmulator('127.0.0.1', 9000);
    }
    const signedIn = await new Promise(resolve => { const off = auth.onAuthStateChanged(u => { off(); resolve(u); }); });
    const uid = (signedIn || (await auth.signInAnonymously()).user).uid;
    return { db: makeDb(fs), user: makeUser(uid), room: makeRoom(rtdb, uid) };
  }

  // ---- db ------------------------------------------------------------------
  // Firestore can't hold an array directly inside another array, so those are
  // stored wrapped as {__a: [...]} and unwrapped on the way back.
  const pack = v => Array.isArray(v) ? v.map(x => Array.isArray(x) ? { __a: pack(x) } : pack(x))
    : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pack(x)])) : v;
  const unpack = v => Array.isArray(v) ? v.map(unpack)
    : v && typeof v === 'object' ? (Object.keys(v).length === 1 && Array.isArray(v.__a) ? unpack(v.__a) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, unpack(x)]))) : v;
  // Firestore's error codes, in the runtime's words.
  const CODES = { 'permission-denied': 'invalid_argument', 'invalid-argument': 'invalid_argument', 'resource-exhausted': 'quota_exceeded', unauthenticated: 'not_granted' };
  const fail = e => { const err = new Error((e && e.message) || 'Request failed'); err.code = CODES[e && e.code] || 'unavailable'; return err; };
  const meta = m => ({ fromCache: !!(m && m.fromCache), hasPendingWrites: !!(m && m.hasPendingWrites) });
  const docSnap = d => ({ id: d.id, exists: d.exists, data: () => (d.exists ? unpack(d.data()) : undefined), metadata: meta(d.metadata) });
  const querySnap = s => { const docs = s.docs.map(docSnap); return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: meta(s.metadata) }; };

  function makeDb(fs) {
    const doc = path => ({
      id: path.split('/').pop(), path,
      get: () => fs.doc(path).get().then(docSnap, e => { throw fail(e); }),
      set: data => fs.doc(path).set(pack(data)).catch(e => { throw fail(e); }),
      update: data => fs.doc(path).update(pack(data)).catch(e => { throw fail(e); }),
      delete: () => fs.doc(path).delete().catch(e => { throw fail(e); }),
      onSnapshot: (next, error) => fs.doc(path).onSnapshot(d => next(docSnap(d)), e => error && error(fail(e))),
      collection: sub => collection(path + '/' + sub),
    });
    const collection = path => ({
      path,
      doc: id => doc(path + '/' + (id || fs.collection(path).doc().id)),
      add: data => { const d = doc(path + '/' + fs.collection(path).doc().id); return d.set(data).then(() => d); },
      get: () => fs.collection(path).get().then(querySnap, e => { throw fail(e); }),
      onSnapshot: (next, error) => fs.collection(path).onSnapshot(s => next(querySnap(s)), e => error && error(fail(e))),
    });
    return Object.freeze({ doc, collection });
  }

  // ---- user ----------------------------------------------------------------
  // Anonymous sign-in gives each browser a lasting player id. There are no
  // account names: players are shown by the name they pick in the game.
  function makeUser(uid) {
    const owner = !!cfg.ownerUid && uid === cfg.ownerUid;
    return Object.freeze({
      id: async () => uid,
      me: async () => ({ id: uid, name: '' }),
      isOwner: async () => owner,
      canEdit: async () => owner,
      can: async () => true,
      profiles: async ids => Object.fromEntries(ids.map(id => [id, { id, name: '' }])),
    });
  }

  // ---- room ----------------------------------------------------------------
  // Each open page is a peer: rooms/<room>/<peer> = {by: player id, p: presence},
  // removed by the server when the page goes away. Everyone in a room listens to
  // the whole room. The lobby is rooms/_lobby, where a page only appears while
  // it has something to say (a host listing their race).
  const ROOM_NAME = /^[a-z0-9][a-z0-9_-]{0,47}$/;
  function makeRoom(rtdb, uid) {
    const peerId = rtdb.ref('rooms').push().key, open = new Map();
    let connected = false;
    rtdb.ref('.info/connected').on('value', s => {
      connected = !!s.val();
      if (connected) for (const r of open.values()) r.reassert(); // the server dropped us while we were away
    });
    function openRoom(key, lobby) {
      const ref = rtdb.ref('rooms/' + key), mine = ref.child(peerId), handlers = new Set(), errors = new Set();
      let presence = {}, peers = Object.freeze([]), cache = new Map(), listed = false, timer = 0, alive = true, heard = false;
      const write = () => {
        timer = 0; if (!alive) return;
        if (lobby && !Object.keys(presence).length) { if (listed) { listed = false; mine.onDisconnect().cancel(); mine.remove().catch(() => {}); } return; }
        if (!listed) { listed = true; mine.onDisconnect().remove(); }
        mine.set({ by: uid, p: presence }).catch(() => {});
      };
      const schedule = () => { if (!timer) timer = setTimeout(write, 0); };
      const onValue = snap => {
        const all = snap.val() || {}, next = [], seen = new Map();
        for (const [peer, m] of Object.entries(all)) {
          if (!m || typeof m !== 'object') continue;
          const json = JSON.stringify(m), old = cache.get(peer);
          // Unchanged peers keep the same object, and updatedAt is when they last changed.
          const obj = old && old.json === json ? old.obj : Object.freeze({
            peer, by: typeof m.by === 'string' ? m.by : null, isMe: m.by === uid, sameTab: peer === peerId,
            kind: 'viewer', guest: false, presence: Object.freeze(m.p && typeof m.p === 'object' ? m.p : {}), updatedAt: Date.now(),
          });
          seen.set(peer, { json, obj }); next.push(obj);
        }
        cache = seen; peers = Object.freeze(next); heard = true;
        const change = { peers, joined: [], left: [], updated: [] };
        for (const h of handlers) h(change);
      };
      ref.on('value', onValue, e => { const err = { code: 'not_permitted', message: e.message }; for (const f of errors) f(err); });
      const api = {
        name: lobby ? undefined : key,
        peers: () => peers,
        onPeers(handler, onError) {
          handlers.add(handler); if (onError) errors.add(onError);
          if (heard) setTimeout(() => { if (handlers.has(handler)) handler({ peers, joined: [], left: [], updated: [] }); }, 0);
          return () => { handlers.delete(handler); errors.delete(onError); };
        },
        presence(patch) {
          const next = { ...presence };
          for (const [k, v] of Object.entries(patch || {})) { if (v === null) delete next[k]; else next[k] = v; }
          if (new Blob([JSON.stringify(next)]).size > 4096) return Promise.reject({ code: 'invalid_argument', message: 'Presence is over 4 KiB' });
          presence = next; schedule(); return Promise.resolve();
        },
        emit: () => Promise.reject({ code: 'not_permitted', message: 'Events are not used here' }),
        on: () => () => {},
        connected: () => connected,
        onConnection(handler) { const f = s => handler(!!s.val()); rtdb.ref('.info/connected').on('value', f); return () => rtdb.ref('.info/connected').off('value', f); },
        leave() {
          alive = false; clearTimeout(timer); ref.off('value', onValue); handlers.clear(); errors.clear(); open.delete(key);
          if (listed) { mine.onDisconnect().cancel(); return mine.remove().catch(() => {}); }
          return Promise.resolve();
        },
        reassert() { listed = false; schedule(); },
      };
      open.set(key, api);
      if (!lobby) schedule(); // show up in a race room straight away
      return api;
    }
    const lobby = openRoom('_lobby', true);
    return Object.freeze({
      ...lobby, name: undefined, reassert: undefined,
      join: async name => {
        if (typeof name !== 'string' || !ROOM_NAME.test(name)) throw { code: 'invalid_argument', message: 'Bad room name' };
        return open.get(name) || openRoom(name, false);
      },
    });
  }
})();
