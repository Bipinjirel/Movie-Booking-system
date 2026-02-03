import { createContext, useContext, useState, useEffect, createElement } from "react";
import { auth } from "../config/Firebase";   // ✅ now this works
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, loading };

  return createElement(AuthContext.Provider, { value }, children);
};

export const useAuthContext = () => useContext(AuthContext);
