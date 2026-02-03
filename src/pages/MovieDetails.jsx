import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SeatMap from "../components/SeatMap";
import { useBookingContext } from "../context/BookingContext";
import { useNavigate } from "react-router-dom";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { selectedSeats, setSelectedSeats, setSelectedMovie } = useBookingContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=YOUR_TMDB_API_KEY`
        );
        setMovie(res.data);
        setSelectedMovie(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovie();
  }, [id, setSelectedMovie]);

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }
    navigate("/confirmation");
  };

  if (!movie) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
      <p className="mb-6">{movie.overview}</p>
      <SeatMap selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />
      <button
        onClick={handleConfirm}
        className="mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
      >
        Confirm Booking
      </button>
    </div>
  );
}
