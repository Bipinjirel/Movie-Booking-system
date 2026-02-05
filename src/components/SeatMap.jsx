import { useState } from "react";

export default function SeatMap({
  selectedSeats,
  setSelectedSeats,
  theatre,
  setTheatre,
  showTime,
  setShowTime,
}) {
  const rows = ["A", "B", "C", "D", "E"];
  const seatsPerRow = 8;

  const theatres = ["Grand Cinema", "City Plex", "IMAX Arena"];
  const showTimes = ["10:30", "14:00", "17:00", "20:30"];

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Pricing logic: VIP = $15, Regular = $10
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0);
      const isVIP = row === "A" || row === "B";
      return total + (isVIP ? 15 : 10);
    }, 0);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      {/* Theatre Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">🎬 Select Theatre</label>
        <select
          value={theatre || ""}
          onChange={(e) => setTheatre?.(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-yellow-400 outline-none"
        >
          <option value="" className="text-gray-800">
            Choose a theatre
          </option>
          {theatres.map((t) => (
            <option key={t} value={t} className="text-gray-800">
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Show Time Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">📅 Select Show Time</label>
        <div className="flex gap-2 flex-wrap">
          {showTimes.map((time) => (
            <button
              key={time}
              onClick={() => setShowTime?.(time)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showTime === time
                  ? "bg-yellow-400 text-black"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Screen */}
      <div className="mb-6">
        <div className="h-2 bg-gradient-to-r from-purple-400 to-orange-400 rounded-full opacity-50"></div>
        <p className="text-center text-gray-400 text-sm mt-2">Screen</p>
      </div>

      {/* Seats */}
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row} className="flex justify-center gap-2">
            <span className="text-white w-6 text-center font-medium">{row}</span>
            {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
              const seatId = `${row}${seatNum}`;
              const isSelected = selectedSeats.includes(seatId);
              const isVIP = row === "A" || row === "B";

              return (
                <button
                  key={seatId}
                  onClick={() => toggleSeat(seatId)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    isSelected
                      ? "bg-green-500 text-white shadow-lg"
                      : isVIP
                      ? "bg-yellow-400/80 text-black hover:bg-yellow-400"
                      : "bg-white/20 text-white hover:bg-white/40"
                  }`}
                  title={`${seatId} - ${isVIP ? "VIP" : "Regular"}`}
                >
                  {seatNum}
                </button>
              );
            })}
            <span className="text-white w-6 text-center font-medium">{row}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-6 text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white/20"></div>
          <span>Regular ($10)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-yellow-400"></div>
          <span>VIP ($15)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-green-500"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Price Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 bg-white/10 rounded-lg p-4 text-center">
          <p className="text-white">
            <span className="text-gray-300">Selected Seats:</span>{" "}
            {selectedSeats.join(", ")}
          </p>
          <p className="text-xl font-bold text-yellow-400 mt-2">
            Total: ${calculateTotal()}
          </p>
        </div>
      )}
    </div>
  );
}
