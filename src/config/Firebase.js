// src/config/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY ,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.FIREBASE_PROJECT_ID ,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET , 
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID ,
  appId: import.meta.env.FIREBASE_APP_ID ,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these so other files can import them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
