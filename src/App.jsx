import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import { ThemeProvider } from "./context/ThemeControl.jsx";

import Navbar from "./pages/Navbar.jsx";
import Footer from "./pages/Footer.jsx";
import Home from "./pages/Home.jsx";
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import MovieDashboard from "./pages/MovieDashboard.jsx";
import Users from "./pages/Users.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { seedFirestore } from "./seed/seedData.js";

function ChoicePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-700 to-orange-500"
    >
      <div className="bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl text-center max-w-md">
        <div className="mb-6">
          <span className="text-6xl">🎬</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Movie Booking
        </h2>
        <p className="text-gray-500 mb-8">Choose an option to continue</p>
        <div className="space-y-4">
          <Link
            to="/register"
            className="block w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-orange-600 transition-all shadow-md"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="block w-full bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  useEffect(() => {
    seedFirestore();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          {!hideNavbar && <Navbar />}
          <div className="min-h-screen">
            <Routes>
              <Route path="/" element={<ChoicePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
              <Route path="/movies/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
              <Route path="/confirmation" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
              <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/admin/dashboard" element={<AdminRoute><MovieDashboard /></AdminRoute>} />
              <Route path="/admin/users" element={<AdminRoute><Users /></AdminRoute>} />
            </Routes>
          </div>
          {!hideNavbar && <Footer />}
        </BookingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
