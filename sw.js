// MushtaqTrack's service worker: it lets the game be installed as an app and
// start without a connection. The page and its own scripts come from the
// network first (so updates arrive straight away), falling back to the saved
// copy offline; the libraries, fonts and icons come from the saved copy first.
// The music (fetched in ranges) and the online services are left alone.
const CACHE = 'mushtaqtrack-1';
const CORE = ['./', 'index.html', 'online.js', 'online-config.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png'];
const LIBS = ['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'https://cdn.jsdelivr.net/npm/three@0.110.0/examples/js/libs/ammo.js'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).then(() => Promise.all(LIBS.map(u => fetch(u).then(r => r.ok && c.put(u, r)).catch(() => {}))))));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url), same = u.origin === self.location.origin;
  if (same && u.pathname.endsWith('.mp3')) return;
  const lib = LIBS.includes(u.href) || u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com' || (u.hostname === 'www.gstatic.com' && u.pathname.startsWith('/firebasejs/'));
  if (!same && !lib) return;
  const keep = res => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
  if (same && !u.pathname.endsWith('.png')) {
    e.respondWith(fetch(req).then(keep).catch(() => caches.match(req, { ignoreSearch: true }).then(m => m || caches.match('index.html'))));
  } else {
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(keep)));
  }
});
