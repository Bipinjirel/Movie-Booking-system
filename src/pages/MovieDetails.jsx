// MovieDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/Firebase";
import SeatMap from "../components/SeatMap";
import { useBookingContext } from "../context/BookingContext";
import { Play, Star, Clock, Calendar, ChevronLeft } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const { 
    selectedSeats, 
    setSelectedSeats, 
    setSelectedMovie,
    bookingInfo,
    setBookingInfo 
  } = useBookingContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const docRef = doc(db, "movies", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const movieData = { id: docSnap.id, ...docSnap.data() };
          setMovie(movieData);
          setSelectedMovie(movieData);
        } else {
          console.error("Movie not found in Firestore");
          navigate("/movies");
        }
      } catch (error) {
        console.error("Error fetching movie from Firestore:", error);
        navigate("/movies");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMovie();
  }, [id, navigate, setSelectedMovie]);

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    if (!bookingInfo.theatre || !bookingInfo.showTime) {
      alert("Please select a theatre and show time!");
      return;
    }
    setBookingInfo(prev => ({ ...prev, price: selectedSeats.length * 10 }));
    navigate("/confirmation");
  };

  // Get image URL - check if it's a full URL (Firebase Storage or external) or TMDB path
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/500x750?text=No+Image";
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  const getBackdropUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.7), rgba(15,23,42,1)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movie details...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15,23,42,0.8), rgba(15,23,42,1)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="text-center relative z-10">
          <h2 className="text-2xl font-bold text-white mb-4">Movie not found</h2>
          <button 
            onClick={() => navigate("/movies")}
            className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            Back to Movies
          </button>
        </div>
      </div>
    );
  }

  const posterUrl = getImageUrl(movie.poster_path);
  const backdropUrl = getBackdropUrl(movie.backdrop_path);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Backdrop Header */}
      {backdropUrl && (
        <div 
          className="h-[50vh] md:h-[60vh] bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(23,20,40,1)), url(${backdropUrl})`
          }}
        >
          {/* Back Button */}
          <button
            onClick={() => navigate("/movies")}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {/* Play Button - Opens Trailer Modal */}
          {movie.trailer_key && (
            <button
              onClick={() => setShowTrailer(true)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-3 bg-yellow-400 text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-500 transition-all hover:scale-110 shadow-lg"
            >
              <Play size={24} fill="black" />
              Watch Trailer
            </button>
          )}
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 pb-8" style={{ marginTop: backdropUrl ? '-80px' : '20px' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="lg:w-1/3" style={{ marginTop: backdropUrl ? '-60px' : '0' }}>
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <img
                src={posterUrl}
                alt={movie.title}
                className="relative w-full rounded-xl shadow-2xl"
              />
              {/* Play Button Overlay */}
              {movie.trailer_key && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"
                >
                  <div className="w-20 h-20 rounded-full bg-yellow-400 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
                    <Play size={40} fill="black" className="text-black ml-2" />
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="lg:w-2/3 pt-4">
            {/* Status Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-full font-medium text-sm ${
                movie.status === "coming_soon" 
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                  : "bg-green-500/20 text-green-400 border border-green-500/30"
              }`}>
                {movie.status === "coming_soon" ? "Coming Soon" : "Now Showing"}
              </span>
              <span className="flex items-center gap-1 text-yellow-400 font-medium">
                <Star size={16} fill="yellow-400" />
                {movie.rating} Rating
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-300 mb-6">
              <span className="flex items-center gap-2">
                <Clock size={18} className="text-yellow-400" />
                {movie.duration} min
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={18} className="text-yellow-400" />
                {movie.genre?.join(", ")}
              </span>
            </div>

            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              {movie.synopsis}
            </p>

            {/* Seat selection */}
            <h3 className="text-2xl font-bold text-white mb-4">Select Your Seats</h3>
            <SeatMap 
              selectedSeats={selectedSeats} 
              setSelectedSeats={setSelectedSeats}
              theatre={bookingInfo.theatre}
              setTheatre={(theatre) => setBookingInfo(prev => ({ ...prev, theatre }))}
              showTime={bookingInfo.showTime}
              setShowTime={(showTime) => setBookingInfo(prev => ({ ...prev, showTime }))}
            />

            <button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0}
              className={`mt-6 w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                selectedSeats.length > 0
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 shadow-lg hover:shadow-yellow-400/25 cursor-pointer"
                  : "bg-gray-500 text-gray-300 cursor-not-allowed"
              }`}
            >
              {selectedSeats.length > 0 
                ? `Confirm Booking - $${selectedSeats.length * 10}`
                : "Select Seats to Continue"
              }
            </button>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && movie.trailer_key && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-yellow-400 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
              title={`${movie.title} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
