// BookingContext.jsx
import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState({
    theatre: "",
    showTime: "",
    price: 0,
  });

  const value = {
    selectedMovie,
    setSelectedMovie,
    selectedSeats,
    setSelectedSeats,
    bookingInfo,
    setBookingInfo,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook for easy access
export const useBookingContext = () => useContext(BookingContext);
