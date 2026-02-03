// src/config/Firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAbhG-Dddlb5QjN4952_zIf5_E2kb9HrFY",
  authDomain: "movie-booking-system-7260b.firebaseapp.com",
  projectId: "movie-booking-system-7260b",
  storageBucket: "movie-booking-system-7260b.appspot.com", // ✅ fixed: should end with .appspot.com
  messagingSenderId: "801912169357",
  appId: "1:801912169357:web:6995557c4eb77ddc2193c4",
  measurementId: "G-D9ZV6K0Y6L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export these so other files can import them
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
