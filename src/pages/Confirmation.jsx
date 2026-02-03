import { useBookingContext } from "../context/BookingContext";

export default function Confirmation() {
  const { selectedMovie, selectedSeats } = useBookingContext();

  if (!selectedMovie) return <p>No booking found!</p>;

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Booking Confirmed!</h2>
      <p className="mb-2">Movie: {selectedMovie.title}</p>
      <p className="mb-2">Seats: {selectedSeats.join(", ")}</p>
      <p className="text-green-600 font-semibold mt-4">Enjoy your movie 🎬</p>
    </div>
  );
}
