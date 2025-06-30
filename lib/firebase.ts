// lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase config from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAow7_HkDwFMRyWKPt-CDNB2aM_dDHZNfY",
  authDomain: "atlas-lumigram-d7ebe.firebaseapp.com",
  projectId: "atlas-lumigram-d7ebe",
  storageBucket: "atlas-lumigram-d7ebe.appspot.com", // fix: use .app**spot**.com
  messagingSenderId: "823121526760",
  appId: "1:823121526760:web:4d2789cd3adb1a0716ee5d",
  measurementId: "G-B6JQ611XHP"
};

// Prevent re-initialization during Fast Refresh
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Export the Auth instance
const auth = getAuth(app);
export { auth };
