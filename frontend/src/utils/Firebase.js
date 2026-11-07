import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB1pIGDYK2CWRWKAG4eAJhSSi75Bu4eXbg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "learning-mananagement-sy-17d27.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "learning-mananagement-sy-17d27",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "learning-mananagement-sy-17d27.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "694813844924",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:694813844924:web:5b5ef2f782f2bf45a437b9"
};

// IMPORTANT: prevent multiple init
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();