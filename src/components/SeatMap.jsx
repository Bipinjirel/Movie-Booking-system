export default function SeatMap({ selectedSeats, setSelectedSeats }) {
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="grid grid-cols-6 gap-4">
      {seats.map((seat) => (
        <button
          key={seat}
          onClick={() => toggleSeat(seat)}
          className={`px-4 py-2 rounded ${
            selectedSeats.includes(seat)
              ? "bg-green-500 text-white"
              : "bg-gray-300"
          }`}
        >
          {seat}
        </button>
      ))}
    </div>
  );
}
