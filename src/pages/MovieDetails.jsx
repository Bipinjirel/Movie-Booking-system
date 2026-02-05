import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SeatMap from "../components/SeatMap";
import { useBookingContext } from "../context/BookingContext";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const { selectedSeats, setSelectedSeats, setSelectedMovie } = useBookingContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=80d491707d8cf7b38aa19c7ccab0952f&append_to_response=videos`
        );
        setMovie(res.data);
        setSelectedMovie(res.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">{movie.title}</h2>

      {/* Flexbox layout: poster left, seat map right */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster + details */}
        <div className="md:w-1/2">
          <div className="shadow-2xl rounded-lg overflow-hidden mb-6">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="mb-6">{movie.overview}</p>
          <p className="text-sm text-gray-600 mb-2">Rating: {movie.vote_average}</p>
          <p className="text-sm text-gray-600 mb-2">Release Date: {movie.release_date}</p>

          {movie.videos?.results?.length > 0 && (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${movie.videos.results[0].key}`}
              title="Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="mt-6 rounded-lg shadow-xl"
            ></iframe>
          )}
        </div>

        {/* Seat selection beside poster */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Select Your Seats</h3>
          <SeatMap selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} />

          <button
            onClick={handleConfirm}
            className="mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 w-full"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
