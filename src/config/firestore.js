import { getFirestore } from "firebase/firestore";
import app from "./Firebase.js";

export const db = getFirestore(app);
