import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore'; // ✅ use this
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAow7_HkDwFMRyWKPt-CDNB2aM_dDHZNfY',
  authDomain: 'atlas-lumigram-d7ebe.firebaseapp.com',
  projectId: 'atlas-lumigram-d7ebe',
  storageBucket: 'atlas-lumigram-d7ebe.appspot.com',
  messagingSenderId: '823121526760',
  appId: '1:823121526760:web:4d2789cd3adb1a0716ee5d',
  measurementId: 'G-B6JQ611XHP',
};

// ✅ initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Use long polling (only this once!)
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, db, storage };
