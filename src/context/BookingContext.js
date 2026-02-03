import { createContext, useContext, useState, createElement } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInfo, setBookingInfo] = useState(null);

  const value = {
    selectedMovie,
    setSelectedMovie,
    selectedSeats,
    setSelectedSeats,
    bookingInfo,
    setBookingInfo,
  };

  // Use React.createElement instead of JSX
  return createElement(BookingContext.Provider, { value }, children);
};

export const useBookingContext = () => useContext(BookingContext);
