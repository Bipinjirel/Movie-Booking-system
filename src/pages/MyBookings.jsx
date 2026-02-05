import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
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
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const bookingList = snapshot.docs.map(doc => ({
          id: doc.id, 
          ...doc.data()
        }));
        setBookings(bookingList);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 p-8">
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
              className="inline-block bg-gradient-to-r from-purple-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-orange-600 transition-all"
            >
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div 
                key={b.id} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg"
              >
                {b.posterPath && (
                  <img 
                    src={b.posterPath.startsWith('http') ? b.posterPath : `https://image.tmdb.org/t/p/w200${b.posterPath}`}
                    alt={b.movieTitle}
                    className="w-32 h-48 object-cover rounded-lg shadow-md"
                  />
                )}
                <div className="flex-1 text-white">
                  <h3 className="text-2xl font-bold text-yellow-400 mb-2">
                    {b.movieTitle}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p className="text-gray-300">
                      <span className="text-yellow-400">🎬</span> Theatre: {b.theatre}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-yellow-400">🪑</span> Seats: {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-yellow-400">📅</span> Show Time: {b.showTime}
                    </p>
                    <p className="text-gray-300">
                      <span className="text-yellow-400">📆</span> Booked: {b.createdAt 
                        ? new Date(b.createdAt.toDate?.() || b.createdAt).toLocaleDateString() 
                        : "Unknown"}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
                    Confirmed ✅
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
