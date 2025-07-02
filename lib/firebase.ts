// lib/firebase.ts

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// ✅ Firebase config from your Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyAow7_HkDwFMRyWKPt-CDNB2aM_dDHZNfY',
  authDomain: 'atlas-lumigram-d7ebe.firebaseapp.com',
  projectId: 'atlas-lumigram-d7ebe',
  storageBucket: 'atlas-lumigram-d7ebe.appspot.com',
  messagingSenderId: '823121526760',
  appId: '1:823121526760:web:4d2789cd3adb1a0716ee5d',
  measurementId: 'G-B6JQ611XHP',
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Optional: Only initialize analytics if supported
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

// ✅ Export for use in app
export { app, auth, db, storage };
