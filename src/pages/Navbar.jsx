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
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 via-purple-700 to-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      {/* Left side: App title */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎬</span>
        <h1 className="text-xl font-bold text-yellow-300 hover:text-yellow-400 transition-colors">
          Movie Booking
        </h1>
      </div>

      {/* Center: Navigation links */}
      <div className="flex gap-8 justify-center flex-1">
        <Link 
          to="/home" 
          className="hover:text-yellow-300 transition-colors font-medium"
        >
          Home
        </Link>
        <Link 
          to="/movies" 
          className="hover:text-yellow-300 transition-colors font-medium"
        >
          Movies
        </Link>
        {user && (
          <Link 
            to="/my-bookings" 
            className="hover:text-yellow-300 transition-colors font-medium"
          >
            My Bookings
          </Link>
        )}
      </div>

      {/* Right side: Avatar + Logout */}
      {user && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-purple-900/50 px-3 py-1 rounded-full">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 border-yellow-300"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-yellow-300 text-purple-800 flex items-center justify-center font-bold">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <span className="text-sm text-yellow-100 hidden md:block">
              {user.displayName || user.email?.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}
