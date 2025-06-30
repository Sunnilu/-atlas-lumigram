// lib/firbase.ts
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAow7_HkDwFMRyWKPt-CDNB2aM_dDHZNfY",
  authDomain: "atlas-lumigram-d7ebe.firebaseapp.com",
  projectId: "atlas-lumigram-d7ebe",
  storageBucket: "atlas-lumigram-d7ebe.firebasestorage.app",
  messagingSenderId: "823121526760",
  appId: "1:823121526760:web:4d2789cd3adb1a0716ee5d",
  measurementId: "G-B6JQ611XHP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);