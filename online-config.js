// Settings for the online features (community tracks, leaderboards, ghosts,
// names, live races and chat). Leave this as null and the game is
// single-player. To turn them on, follow "Turning on the online features" in
// README.md and paste your Firebase project's settings below.
//
// These settings are not secret: Firebase web settings are meant to be public.
// What protects the data is the security rules in firestore.rules and
// database.rules.json.
window.MUSHTAQ_ONLINE = null;

/* Filled in, it looks like this:
window.MUSHTAQ_ONLINE = {
  firebase: {
    apiKey: 'AIza...',
    authDomain: 'your-project.firebaseapp.com',
    databaseURL: 'https://your-project-default-rtdb.firebaseio.com',
    projectId: 'your-project',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: '1234567890',
    appId: '1:1234567890:web:abc123',
  },
  // Your player id, which lets you remove anyone's tracks and times.
  ownerUid: '',
};
*/
