// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAow7_HkDwFMRyWKPt-CDNB2aM_dDHZNfY",
  authDomain: "atlas-lumigram-d7ebe.firebaseapp.com",
  projectId: "atlas-lumigram-d7ebe",
  storageBucket: "atlas-lumigram-d7ebe.appspot.com",
  messagingSenderId: "823121526760",
  appId: "1:823121526760:web:4d2789cd3adb1a0716ee5d",
  measurementId: "G-B6JQ611XHP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
