// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAnalytics, isSupported, logEvent } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAow7_HkDwFMRyWKPt-CDNB2aM_dDHZNfY',
  authDomain: 'atlas-lumigram-d7ebe.firebaseapp.com',
  projectId: 'atlas-lumigram-d7ebe',
  storageBucket: 'atlas-lumigram-d7ebe.appspot.com',
  messagingSenderId: '823121526760',
  appId: '1:823121526760:web:4d2789cd3adb1a0716ee5d',
  measurementId: 'G-B6JQ611XHP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize analytics if supported
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    // Log app open event
    logEvent(analytics, 'app_open');
  }
});

// Authentication utilities
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Firestore utilities
export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  } catch (error) {
    console.error('Failed to get document:', error);
    throw error;
  }
};

export const setDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data);
  } catch (error) {
    console.error('Failed to set document:', error);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Failed to update document:', error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Failed to delete document:', error);
    throw error;
  }
};

export const queryCollection = async (collectionName: string, queryConstraints: any[]) => {
  try {
    const q = query(collection(db, collectionName), ...queryConstraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Failed to query collection:', error);
    throw error;
  }
};

// Storage utilities
export const uploadFile = async (filePath: string, file: Blob | Uint8Array | ArrayBuffer) => {
  try {
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw error;
  }
};

export const deleteFile = async (filePath: string) => {
  try {
    const desertRef = ref(storage, filePath);
    await deleteObject(desertRef);
  } catch (error) {
    console.error('Failed to delete file:', error);
    throw error;
  }
};

// Auth state listener
export const subscribeToAuthState = (callback: (user: any) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Export core services
export { app, auth, db, storage };