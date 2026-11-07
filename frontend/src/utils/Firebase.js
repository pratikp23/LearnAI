import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCy6gPIyPJ5GXNe1onmZBltm1XNNt9GLnk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "learn-ai-lms.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "learn-ai-lms",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "learn-ai-lms.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "334870095104",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:334870095104:web:4a5e198b49844ba53a3fe5"
};

// IMPORTANT: prevent multiple init
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();