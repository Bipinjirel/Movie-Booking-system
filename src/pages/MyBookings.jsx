// src/pages/MyBookings.jsx
import { useBookingContext } from "../context/BookingContext";

export default function MyBookings() {
  const { bookingInfo } = useBookingContext();

  if (!bookingInfo) {
    return <p className="p-8">No bookings yet!</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      <p>Movie: {bookingInfo.movie}</p>
      <p>Seats: {bookingInfo.seats.join(", ")}</p>
      <p>Date: {bookingInfo.date}</p>
    </div>
  );
}
