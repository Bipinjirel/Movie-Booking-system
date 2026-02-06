import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/Firebase"; 
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyBookings() {
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBookings = async () => {
      try {
        const q = query(
          collection(db, "bookings"), 
          where("userId", "==", user.uid)
        );
        const snapshot = await getDocs(q);
        let bookingList = snapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        
        // Sort by createdAt (client-side since orderBy requires composite index)
        bookingList.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
          return dateB - dateA; // desc order
        });
        
        setBookings(bookingList);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Helper function to get image URL
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-8 text-center">
          🎬 My Bookings
        </h2>
        
        {bookings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
            <span className="text-6xl mb-4 block">🎫</span>
            <p className="text-xl text-gray-300 mb-6">You have no bookings yet.</p>
            <Link 
              to="/movies" 
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(b => (
              <div 
                key={b.id}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/10 hover:border-yellow-400/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Movie Poster */}
                  <div className="relative md:w-48 h-64 md:h-auto flex-shrink-0">
                    <img 
                      src={getImageUrl(b.posterPath)}
                      alt={b.movieTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      CONFIRMED
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                          {b.movieTitle}
                        </h3>
                        
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                              <span className="text-yellow-400">🎬</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Theatre</p>
                              <p className="text-white font-semibold">{b.theatre}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                              <span className="text-yellow-400">📅</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Show Time</p>
                              <p className="text-white font-semibold">{b.showTime}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                              <span className="text-yellow-400">🪑</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Seats</p>
                              <p className="text-white font-semibold">{Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                              <span className="text-yellow-400">💰</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Total Paid</p>
                              <p className="text-white font-semibold">Rs.{b.totalPrice}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                              <span className="text-yellow-400">📆</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Booked On</p>
                              <p className="text-white font-semibold">
                                {b.createdAt 
                                  ? new Date(b.createdAt.toDate?.() || b.createdAt).toLocaleDateString("en-US", { 
                                      day: 'numeric', 
                                      month: 'short', 
                                      year: 'numeric' 
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
                              <span className="text-yellow-400">🎟️</span>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400">Booking ID</p>
                              <p className="text-white font-semibold text-xs">{b.id.slice(-8).toUpperCase()}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="bg-white p-2 rounded-lg">
                          <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-2xl">🎫</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400">Scan at theatre</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 -left-4 w-8 h-8 bg-blue-950 rounded-full -translate-y-1/2"></div>
                <div className="absolute top-1/2 -right-4 w-8 h-8 bg-blue-950 rounded-full -translate-y-1/2"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
