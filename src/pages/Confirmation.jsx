import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useBookingContext } from "../context/BookingContext";
import { CheckCircle, Ticket, Calendar, MapPin, Clock, ChevronRight } from "lucide-react";

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { setSelectedMovie, setSelectedSeats, setBookingInfo } = useBookingContext();
  const [isNavigating, setIsNavigating] = useState(false);

  // Get booking data from navigate state
  const bookingData = location.state;
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if we have valid booking data from navigate state
    if (!bookingData || !bookingData.bookingId) {
      // If no booking data, redirect to movies
      navigate("/movies");
      return;
    }

    // Show success after a brief delay for animation
    setTimeout(() => {
      setShowSuccess(true);
    }, 100);
  }, [bookingData, navigate]);

  // Calculate total price
  const calculateTotal = () => {
    return bookingData?.total || 0;
  };

  const handleViewBookings = () => {
    setIsNavigating(true);
    setSelectedMovie(null);
    setSelectedSeats([]);
    setBookingInfo({ theatre: "", showTime: "", price: 0 });
    navigate("/my-bookings");
  };

  const handleBrowseMovies = () => {
    setIsNavigating(true);
    setSelectedMovie(null);
    setSelectedSeats([]);
    setBookingInfo({ theatre: "", showTime: "", price: 0 });
    navigate("/movies");
  };

  if (!showSuccess || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your booking...</p>
        </div>
      </div>
    );
  }

  const movie = bookingData.movie;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Success Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4 animate-pulse">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-green-400">Your tickets have been booked successfully</p>
        </div>

        {/* Booking Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          {/* Movie Info */}
          <div className="flex gap-4 p-5 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 border-b border-white/10">
            <div className="w-20 h-28 rounded-lg overflow-hidden flex-shrink-0 shadow-lg">
              <img 
                src={movie?.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : "https://via.placeholder.com/100x150?text=Movie"} 
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-2">{movie?.title}</h2>
              <div className="flex items-center gap-2 text-yellow-400 mb-1">
                <MapPin size={14} />
                <span className="text-sm">{bookingData?.theatre}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Calendar size={14} />
                <span className="text-sm">{bookingData?.showTime}</span>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-5 space-y-4">
            {/* Seats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <Ticket size={18} />
                <span>Selected Seats</span>
              </div>
              <div className="flex gap-1 flex-wrap justify-end">
                {bookingData?.seats?.map((seat, index) => (
                  <span key={seat} className="inline-flex items-center justify-center w-8 h-8 rounded bg-yellow-400/20 text-yellow-400 text-sm font-medium">
                    {seat}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10"></div>

            {/* Price & Status */}
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Paid</span>
              <span className="text-2xl font-bold text-green-400">Rs.{calculateTotal()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status</span>
              <span className="inline-flex items-center gap-1 text-green-400 font-medium">
                <CheckCircle size={16} />
                Confirmed
              </span>
            </div>

            {/* Booking Reference */}
            <div className="bg-black/30 rounded-xl p-4 text-center mt-4">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Booking Reference</p>
              <p className="text-yellow-400 font-mono font-bold text-lg">
                {bookingData?.bookingId?.slice(-8).toUpperCase() || "N/A"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-5 bg-white/5 space-y-3">
            <button
              onClick={handleViewBookings}
              disabled={isNavigating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
            >
              <Ticket size={18} />
              View My Bookings
              <ChevronRight size={18} />
            </button>
            <button
              onClick={handleBrowseMovies}
              disabled={isNavigating}
              className="w-full flex items-center justify-center gap-2 bg-white/10 text-white py-3 rounded-xl font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
            >
              <Clock size={18} />
              Browse More Movies
            </button>
          </div>
        </div>

        {/* Email Note */}
        <p className="text-center text-gray-400 text-sm mt-6">
          Confirmation sent to <span className="text-white font-medium">{bookingData?.userEmail || user?.email}</span>
        </p>
      </div>
    </div>
  );
}
