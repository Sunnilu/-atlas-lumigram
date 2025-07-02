// lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// ✅ Your Firebase config
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// 🔐 Auth helpers
export const login = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const register = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth);
};

export const subscribeToAuthState = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// 🗃 Firestore helpers
export const getDocument = async (collectionName: string, docId: string) => {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export const setDocument = async (collectionName: string, docId: string, data: any) => {
  await setDoc(doc(db, collectionName, docId), data);
};

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  await updateDoc(doc(db, collectionName, docId), data);
};

export const deleteDocument = async (collectionName: string, docId: string) => {
  await deleteDoc(doc(db, collectionName, docId));
};

export const queryCollection = async (collectionName: string, constraints: any[]) => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// ☁️ Storage helpers
export const uploadFile = async (filePath: string, file: Blob | Uint8Array | ArrayBuffer) => {
  const fileRef = ref(storage, filePath);
  const snapshot = await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteFile = async (filePath: string) => {
  const fileRef = ref(storage, filePath);
  await deleteObject(fileRef);
};

// Export core
export { app, auth, db, storage };
