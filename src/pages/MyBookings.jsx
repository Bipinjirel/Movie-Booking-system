import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

export default function MyBookings({ user }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const q = query(collection(db, "bookings"), where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, [user]);

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">{booking.movieTitle}</h2>
            <p className="text-gray-700">🎬 Theatre: {booking.theatre}</p>
            <p className="text-gray-700">🪑 Seats: {booking.seats.join(", ")}</p>
            <p className="text-gray-700">📅 Date: {booking.showDate}</p>
            <p className="text-gray-700">⏰ Time: {booking.showTime}</p>
            <p className="text-sm text-gray-500 mt-2">
              Booked on: {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
