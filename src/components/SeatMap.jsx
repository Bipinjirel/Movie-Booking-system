import { useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/Firebase";

export default function SeatMap({
  selectedSeats,
  setSelectedSeats,
  theatre,
  setTheatre,
  showTime,
  setShowTime,
  movieId
}) {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const seatsPerRow = 8;

  const theatres = ["Grand Cinema", "City Plex", "IMAX Arena"];
  const showTimes = ["10:30", "14:00", "17:00", "20:30"];
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  // Fetch already booked seats when theatre and showTime are selected
  useEffect(() => {
    if (theatre && showTime && movieId) {
      fetchBookedSeats();
    }
  }, [theatre, showTime, movieId]);

  const fetchBookedSeats = async () => {
    setLoadingSeats(true);
    try {
      // Check if there's a seat availability document
      const seatAvailRef = doc(db, "seatAvailability", `${movieId}_${theatre}_${showTime}`);
      const seatAvailSnap = await getDoc(seatAvailRef);
      
      if (seatAvailSnap.exists()) {
        setBookedSeats(seatAvailSnap.data().bookedSeats || []);
      }
      
      // Also check existing bookings for this movie/theatre/showtime
      const bookingsRef = collection(db, "bookings");
      const q = query(
        bookingsRef,
        where("movieId", "==", movieId),
        where("theatre", "==", theatre),
        where("showTime", "==", showTime),
        where("status", "in", ["confirmed", "pending"])
      );
      const bookingsSnap = await getDocs(q);
      
      const allBookedSeats = new Set();
      bookingsSnap.docs.forEach(doc => {
        const bookingData = doc.data();
        if (bookingData.seats) {
          bookingData.seats.forEach(seat => allBookedSeats.add(seat));
        }
      });
      
      setBookedSeats(Array.from(allBookedSeats));
    } catch (error) {
      console.error("Error fetching booked seats:", error);
    } finally {
      setLoadingSeats(false);
    }
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return; // Can't select already booked seats
    
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Pricing logic: VIP = Rs.350, Regular = Rs.200
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      const row = seat.charAt(0);
      const isVIP = row === "A" || row === "B";
      return total + (isVIP ? 350 : 200);
    }, 0);
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
      {/* Theatre Selection */}
      <div className="mb-6">
        <label className="block text-white font-medium mb-2">🎬 Select Theatre</label>
        <select
          value={theatre || ""}
          onChange={(e) => {
            setTheatre?.(e.target.value);
            setSelectedSeats([]); // Clear seats when theatre changes
          }}
          className="w-full px-4 py-3 rounded-lg bg-white/20 text-white border border-white/30 focus:ring-2 focus:ring-yellow-400 outline-none"
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
              onClick={() => {
                setShowTime?.(time);
                setSelectedSeats([]); // Clear seats when time changes
              }}
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

      {/* Show selected info */}
      {theatre && showTime && (
        <div className="bg-white/10 rounded-lg p-3 mb-4 flex justify-between items-center">
          <div>
            <p className="text-yellow-400 font-medium">🎬 {theatre}</p>
            <p className="text-white">📅 {showTime}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Selected Seats</p>
            <p className="text-white font-bold">{selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}</p>
          </div>
        </div>
      )}

      {/* Seat Selection - only show if theatre and time selected */}
      {theatre && showTime && (
        <>
          {loadingSeats ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-white">Loading seat availability...</p>
            </div>
          ) : (
            <>
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
                      const isBooked = bookedSeats.includes(seatId);
                      const isVIP = row === "A" || row === "B";

                      return (
                        <button
                          key={seatId}
                          onClick={() => toggleSeat(seatId)}
                          disabled={isBooked}
                          className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                            isBooked
                              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "bg-green-500 text-white shadow-lg"
                              : isVIP
                              ? "bg-yellow-400/80 text-black hover:bg-yellow-400"
                              : "bg-white/20 text-white hover:bg-white/40"
                          }`}
                          title={`${seatId} - ${isVIP ? "VIP" : "Regular"} ${isBooked ? "(Booked)" : ""}`}
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
              <div className="flex justify-center gap-6 mt-6 text-sm text-gray-300 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white/20"></div>
                  <span>Regular (Rs.200)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-yellow-400"></div>
                  <span>VIP (Rs.350)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-500"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-600"></div>
                  <span>Booked</span>
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
                    Total: Rs.{calculateTotal()}
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
