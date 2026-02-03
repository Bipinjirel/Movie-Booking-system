import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebase";

export default function Navbar() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // ✅ redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-700 to-orange-600 text-white px-6 py-4 flex justify-between items-center">
      {/* Left side: App title */}
      <h1 className="text-xl font-bold text-yellow-300">Movie Booking</h1>

      {/* Center: Navigation links */}
      <div className="flex gap-6 justify-center flex-1">
        <Link to="/home" className="hover:text-yellow-300">Home</Link>
        <Link to="/movies" className="hover:text-yellow-300">Movies</Link>
        {user && (
          <Link to="/my-bookings" className="hover:text-yellow-300">
            My Bookings
          </Link>
        )}
      </div>

      {/* Right side: Avatar + Logout */}
      {user && (
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-8 h-8 rounded-full border-2 border-yellow-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-yellow-300 text-purple-700 flex items-center justify-center font-bold">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
