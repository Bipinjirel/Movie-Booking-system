import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <p>Loading...</p>;
  }

  // ✅ Example: check if user email matches admin list
  const adminEmails = ["admin@example.com"]; 
  const isAdmin = user && adminEmails.includes(user.email);

  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
