// Settings for the online features (community tracks, leaderboards, ghosts,
// names, live races and chat), from the game's Firebase project. Set this to
// null and the game is single-player. To use a different Firebase project,
// follow "Turning on the online features" in README.md.
//
// These settings are not secret: Firebase web settings are meant to be public.
// What protects the data is the security rules in firestore.rules and
// database.rules.json.
window.MUSHTAQ_ONLINE = {
  firebase: {
    apiKey: 'AIzaSyCc2Caf0ggHVLyOT1ljTF6t-DByPBw2hkY',
    authDomain: 'mushtaqtrack-f15f2.firebaseapp.com',
    databaseURL: 'https://mushtaqtrack-f15f2-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'mushtaqtrack-f15f2',
    storageBucket: 'mushtaqtrack-f15f2.firebasestorage.app',
    messagingSenderId: '593758357329',
    appId: '1:593758357329:web:d8e73bbfddc28d33ee7570',
  },
  // Your player id, which lets you remove anyone's tracks and times.
  ownerUid: '',
};

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
