import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/Firebase";
import { useAuthContext } from "../context/AuthContext";
import { useBookingContext } from "../context/BookingContext";

export default function Confirmation() {
  const { selectedMovie, selectedSeats, bookingInfo } = useBookingContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    if (!selectedMovie || !user) {
      navigate("/movies");
      return;
    }

    const saveBooking = async () => {
      try {
        await addDoc(collection(db, "bookings"), {
          userId: user.uid,
          userEmail: user.email,
          movieId: selectedMovie.id,
          movieTitle: selectedMovie.title || selectedMovie.name,
          posterPath: selectedMovie.poster_path,
          seats: selectedSeats,
          theatre: bookingInfo?.theatre || "Grand Cinema",
          showTime: bookingInfo?.showTime || "19:00",
          totalPrice: bookingInfo?.price || selectedSeats.length * 10,
          status: "confirmed",
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Error saving booking:", error);
      } finally {
        setSaving(false);
      }
    };

    saveBooking();
  }, [selectedMovie, user, navigate, bookingInfo]);

  if (saving) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-xl">Confirming your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
        <div className="mb-6">
          <span className="text-6xl">🎉</span>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h2>
        
        {selectedMovie && (
          <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              {selectedMovie.title || selectedMovie.name}
            </h3>
            <div className="space-y-2 text-white">
              <p className="flex items-center gap-2">
                <span>🎬</span> Theatre: {bookingInfo?.theatre || "Grand Cinema"}
              </p>
              <p className="flex items-center gap-2">
                <span>🪑</span> Seats: {selectedSeats.join(", ")}
              </p>
              <p className="flex items-center gap-2">
                <span>📅</span> Show Time: {bookingInfo?.showTime || "19:00"}
              </p>
              <p className="flex items-center gap-2">
                <span>💰</span> Total: ${bookingInfo?.price || selectedSeats.length * 10}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/my-bookings"
            className="block w-full bg-gradient-to-r from-purple-600 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-orange-600 transition-all"
          >
            View My Bookings
          </Link>
          <Link
            to="/movies"
            className="block w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Browse More Movies
          </Link>
        </div>

        <p className="text-gray-400 text-sm mt-6">
          A confirmation email has been sent to your email address.
        </p>
      </div>
    </div>
  );
}
