// MovieDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, addDoc, collection, serverTimestamp, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../config/Firebase";
import SeatMap from "../components/SeatMap";
import { useBookingContext } from "../context/BookingContext";
import { useAuthContext } from "../context/AuthContext";
import { Play, Star, Clock, Calendar, ChevronLeft, MapPin, Ticket, CreditCard, CheckCircle } from "lucide-react";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Booking step state (1: Theatre, 2: Showtime, 3: Seats, 4: Payment, 5: Confirmation)
  const [bookingStep, setBookingStep] = useState(1);
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    selectedSeats, 
    setSelectedSeats, 
    setSelectedMovie,
    bookingInfo,
    setBookingInfo 
  } = useBookingContext();
  
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Clear previous booking selections when loading a new movie
        setSelectedSeats([]);
        setBookingInfo({ theatre: "", showTime: "", price: 0 });
        setBookingStep(1);
        
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
  }, [id, navigate, setSelectedMovie, setSelectedSeats, setBookingInfo]);

  // Generate unique booking reference ID (like QFX tickets)
  const generateBookingRef = () => {
    const prefix = "QFX";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}${random}`;
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      alert("Please login to book tickets!");
      navigate("/login");
      return;
    }
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    if (!bookingInfo.theatre || !bookingInfo.showTime) {
      alert("Please select a theatre and show time!");
      return;
    }
    
    // Calculate total based on seat type (VIP = Rs.350, Regular = Rs.200)
    const total = selectedSeats.reduce((sum, seat) => {
      const row = seat.charAt(0);
      const isVIP = row === "A" || row === "B";
      return sum + (isVIP ? 350 : 200);
    }, 0);
    
    setIsSaving(true);
    
    try {
      // First, delete all existing bookings for this user
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", user.uid)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);
      
      if (!bookingsSnapshot.empty) {
        const batch = writeBatch(db);
        bookingsSnapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
      }
      
      // Generate unique booking reference
      const bookingRef = generateBookingRef();
      
      // Save new booking to Firestore with bookingDate
      const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        movieId: id,
        movieTitle: movie.title,
        posterPath: movie.poster_path,
        theatre: bookingInfo.theatre,
        showTime: bookingInfo.showTime,
        seats: selectedSeats,
        totalPrice: total,
        status: "confirmed",
        bookingDate: serverTimestamp(),
        bookingRef: bookingRef,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, "bookings"), bookingData);
      
      // Navigate to confirmation with booking data passed via state
      navigate("/confirmation", {
        state: {
          bookingId: docRef.id,
          bookingRef: bookingRef,
          movie: movie,
          theatre: bookingInfo.theatre,
          showTime: bookingInfo.showTime,
          seats: selectedSeats,
          total: total,
          userEmail: user.email,
          bookingDate: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error saving booking: ", error);
      alert("Failed to save booking. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Navigation between steps
  const nextStep = () => {
    if (bookingStep === 1 && !bookingInfo.theatre) {
      alert("Please select a theatre!");
      return;
    }
    if (bookingStep === 2 && !bookingInfo.showTime) {
      alert("Please select a show time!");
      return;
    }
    if (bookingStep === 3 && selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    setBookingStep(prev => prev + 1);
  };

  const prevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  // Get image URL
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

  // Calculate total price
  const calculateTotal = () => {
    return selectedSeats.reduce((sum, seat) => {
      const row = seat.charAt(0);
      const isVIP = row === "A" || row === "B";
      return sum + (isVIP ? 350 : 200);
    }, 0);
  };

  // Step indicator
  const steps = [
    { num: 1, icon: MapPin, label: "Theatre" },
    { num: 2, icon: Clock, label: "Time" },
    { num: 3, icon: Ticket, label: "Seats" },
    { num: 4, icon: CreditCard, label: "Payment" },
    { num: 5, icon: CheckCircle, label: "Done" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Backdrop Header */}
      {backdropUrl && (
        <div 
          className="h-[40vh] md:h-[50vh] bg-cover bg-center relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(23,20,40,1)), url(${backdropUrl})`
          }}
        >
          <button
            onClick={() => navigate("/movies")}
            className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-black/60 transition-all"
          >
            <ChevronLeft size={20} />
            Back
          </button>

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
      
      <div className="max-w-6xl mx-auto px-4 pb-8" style={{ marginTop: backdropUrl ? '-60px' : '20px' }}>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie Info Sidebar */}
          <div className="lg:w-1/3">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              <img
                src={posterUrl}
                alt={movie.title}
                className="relative w-full rounded-xl shadow-2xl"
              />
            </div>
            
            <div className="mt-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{movie.title}</h1>
              
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
                  {movie.rating}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <span className="flex items-center gap-2">
                  <Clock size={18} className="text-yellow-400" />
                  {movie.duration} min
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={18} className="text-yellow-400" />
                  {movie.genre?.join(", ")}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm leading-relaxed">
                {movie.synopsis}
              </p>
            </div>
          </div>

          {/* Booking Flow */}
          <div className="lg:w-2/3">
            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-6 bg-white/10 rounded-xl p-4">
              {steps.map((step, index) => (
                <div key={step.num} className="flex items-center">
                  <div 
                    className={`flex items-center gap-2 ${
                      bookingStep >= step.num ? "text-yellow-400" : "text-gray-500"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      bookingStep >= step.num ? "bg-yellow-400 text-black" : "bg-white/20 text-gray-400"
                    }`}>
                      <step.icon size={16} />
                    </div>
                    <span className="hidden sm:inline font-medium">{step.label}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      bookingStep > step.num ? "bg-yellow-400" : "bg-white/20"
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              {/* Step 1: Theatre Selection */}
              {bookingStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="text-yellow-400" />
                    Select Theatre
                  </h3>
                  <div className="grid gap-3">
                    {["Grand Cinema", "City Plex", "IMAX Arena"].map((theatre) => (
                      <button
                        key={theatre}
                        onClick={() => {
                          setBookingInfo(prev => ({ ...prev, theatre }));
                          setSelectedSeats([]);
                        }}
                        className={`p-4 rounded-lg border transition-all ${
                          bookingInfo.theatre === theatre
                            ? "bg-yellow-400/20 border-yellow-400 text-white"
                            : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="font-medium">{theatre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Showtime Selection */}
              {bookingStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="text-yellow-400" />
                    Select Show Time
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["10:30", "14:00", "17:00", "20:30"].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          setBookingInfo(prev => ({ ...prev, showTime: time }));
                          setSelectedSeats([]);
                        }}
                        className={`p-4 rounded-lg border transition-all ${
                          bookingInfo.showTime === time
                            ? "bg-yellow-400/20 border-yellow-400 text-white"
                            : "bg-white/5 border-white/20 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        <span className="font-medium text-lg">{time}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Seat Selection */}
              {bookingStep === 3 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Ticket className="text-yellow-400" />
                    Select Your Seats
                  </h3>
                  <SeatMap 
                    selectedSeats={selectedSeats} 
                    setSelectedSeats={setSelectedSeats}
                    theatre={bookingInfo.theatre}
                    setTheatre={(theatre) => setBookingInfo(prev => ({ ...prev, theatre }))}
                    showTime={bookingInfo.showTime}
                    setShowTime={(showTime) => setBookingInfo(prev => ({ ...prev, showTime }))}
                    movieId={id}
                  />
                </div>
              )}

              {/* Step 4: Payment/Identity */}
              {bookingStep === 4 && (
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="text-yellow-400" />
                    Confirm Booking
                  </h3>
                  
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-medium mb-3">Booking Summary</h4>
                    <div className="space-y-2 text-gray-300">
                      <div className="flex justify-between">
                        <span>Movie</span>
                        <span className="text-white">{movie.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Theatre</span>
                        <span className="text-white">{bookingInfo.theatre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Show Time</span>
                        <span className="text-white">{bookingInfo.showTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Seats</span>
                        <span className="text-white">{selectedSeats.join(", ")}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 mt-2">
                        <div className="flex justify-between text-lg">
                          <span className="text-yellow-400">Total</span>
                          <span className="text-yellow-400 font-bold">Rs.{calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {!user && (
                    <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-4">
                      <p className="text-yellow-400 text-sm">
                        Please login to complete your booking. Your selected seats will be saved.
                      </p>
                    </div>
                  )}
                  
                  {user && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle size={16} />
                        Booking as: {user.email}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {bookingStep > 1 && bookingStep < 5 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-all"
                >
                  Back
                </button>
              )}
              
              {bookingStep < 4 && (
                <button
                  onClick={nextStep}
                  className="ml-auto px-8 py-3 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-500 transition-all"
                >
                  Continue
                </button>
              )}
              
              {bookingStep === 4 && (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSaving}
                  className="ml-auto px-8 py-3 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold hover:from-yellow-500 hover:to-orange-600 transition-all flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      Pay & Book
                    </>
                  )}
                </button>
              )}
            </div>
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
