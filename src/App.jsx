import { useEffect } from "react";
import { Routes, Route, useLocation, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import { BookingProvider } from "./context/BookingContext.js";
import { ThemeProvider } from "./context/ThemeControl.js";

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
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a0dad, #ff6600)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#6a0dad", marginBottom: "1.5rem" }}>
          Welcome to Movie Booking 🎬
        </h2>
        <p style={{ marginBottom: "1rem" }}>Choose an option to continue:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link
            to="/register"
            style={{
              backgroundColor: "#6a0dad",
              color: "white",
              padding: "0.8rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Register
          </Link>
          <Link
            to="/login"
            style={{
              backgroundColor: "#ff6600",
              color: "white",
              padding: "0.8rem",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  // ✅ Run seeding once when App mounts
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
