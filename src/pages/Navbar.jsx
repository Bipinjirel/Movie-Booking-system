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
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex justify-between items-center shadow-xl border-b border-white/10">
      {/* Left side: App title */}
      <div className="flex items-center gap-3">
        <div className="relative group cursor-pointer">
          {/* Glowing effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Main logo container */}
          <div className="relative flex items-center gap-3 bg-slate-900/95 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10 shadow-xl">
            {/* Custom film reel icon */}
            <div className="relative w-10 h-10">
              <svg viewBox="0 0 100 100" className="w-full h-full fill-none drop-shadow-lg">
                {/* Outer ring */}
                <circle cx="50" cy="50" r="45" stroke="url(#navLogoGradient)" strokeWidth="4" />
                {/* Inner circle */}
                <circle cx="50" cy="50" r="28" stroke="url(#navLogoGradient)" strokeWidth="3" />
                {/* Film holes */}
                <circle cx="50" cy="12" r="5" fill="url(#navLogoGradient)" />
                <circle cx="50" cy="88" r="5" fill="url(#navLogoGradient)" />
                <circle cx="12" cy="50" r="5" fill="url(#navLogoGradient)" />
                <circle cx="88" cy="50" r="5" fill="url(#navLogoGradient)" />
                {/* Center play triangle */}
                <polygon points="44,38 44,62 66,50" fill="url(#navLogoGradient)" />
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="navLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Logo text */}
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                CineBook
              </span>
              <span className="text-[10px] text-gray-500 -mt-0.5 tracking-wider font-medium">PREMIUM CINEMA</span>
            </div>
          </div>
        </div>
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
      {user ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-9 h-9 rounded-full border-2 border-yellow-400 shadow-lg"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900 shadow-lg">
                {user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : user.email?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {user.displayName || user.email?.split('@')[0]}
              </span>
              <span className="text-xs text-gray-400">
                {user.email?.split('@')[0]}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group relative px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 transition-all shadow-lg hover:shadow-red-500/25 flex items-center gap-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </span>
          </button>
        </div>
      ) : (
        <Link
          to="/login"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-6 py-2 rounded-full font-bold hover:from-yellow-300 hover:to-orange-400 transition-all shadow-lg hover:shadow-yellow-400/25"
        >
          Sign In
        </Link>
      )}
    </nav>
  );
}
