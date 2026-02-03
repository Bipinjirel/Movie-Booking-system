import { getAuth, GoogleAuthProvider } from "firebase/auth";
import app from "./Firebase";

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
