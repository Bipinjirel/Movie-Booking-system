import { getFirestore } from "firebase/firestore";
import app from "./Firebase";

export const db = getFirestore(app);
