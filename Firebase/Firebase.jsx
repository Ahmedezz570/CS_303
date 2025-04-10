import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyAg3mV79kZOYINI_OB7wcOGE3ek5QXE0yg",
  authDomain: "cs-303-a525a.firebaseapp.com",
  projectId: "cs-303-a525a",
  storageBucket: "cs-303-a525a.firebasestorage.app",
  messagingSenderId: "625620482602",
  appId: "1:625620482602:web:437c2e4902ea95545d2153"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db, collection, getDocs };