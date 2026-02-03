import { getStorage } from "firebase/storage";
import app from "./Firebase";

export const storage = getStorage(app);
