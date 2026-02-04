import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  // ✅ Fetch movies from TMDb API
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results); // TMDb returns results array
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  const nextSlide = () => {
    if (startIndex + visibleCount < movies.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-600 to-orange-500 text-white text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Movie Booking</h1>
      <p className="text-lg mb-6">Browse movies, select seats, and book your tickets easily!</p>

      <div className="flex gap-4 mb-8">
        <Link to="/movies" className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500">
          Book Now
        </Link>
        <Link to="/locations" className="bg-green-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500">
          See Locations
        </Link>
      </div>

      {/* ✅ Popular Movies Slider */}
      <h2 className="text-2xl font-semibold mb-4">Popular Movies</h2>
      <div className="flex items-center gap-6">
        <button
          onClick={prevSlide}
          className="bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-600 text-2xl shadow-lg"
        >
          ◀
        </button>

        <div className="flex gap-4">
          {movies.slice(startIndex, startIndex + visibleCount).map((movie) => (
            <div key={movie.id} className="bg-white text-black rounded shadow-lg p-2 w-48">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover rounded"
              />
              <h3 className="mt-2 font-semibold text-center">{movie.title}</h3>
            </div>
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded-full hover:bg-blue-600 text-2xl shadow-lg"
        >
          ▶
        </button>
      </div>

      <footer className="mt-12 text-sm text-gray-200">© 2026 Movie Booking</footer>
    </div>
  );
}
