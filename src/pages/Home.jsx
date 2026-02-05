import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [movies, setMovies] = useState([]);

  // ✅ Fetch movies from TMDb Discover API
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f")
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results); // TMDb returns results array
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-600 to-orange-500 text-white">
      {/* ✅ Poster Banner */}
      <div className="flex flex-col items-center justify-center text-center py-20 px-6">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Movie Booking 🎬</h1>
        <p className="text-lg mb-8 max-w-2xl">
          Browse movies, select seats, and book your tickets easily!
        </p>

        <div className="flex gap-6">
          <Link
            to="/movies"
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 shadow-lg"
          >
            Book Now
          </Link>
          <Link
            to="/locations"
            className="bg-green-400 text-black px-8 py-3 rounded-lg font-semibold hover:bg-green-500 shadow-lg"
          >
            See Locations
          </Link>
        </div>
      </div>

      {/* ✅ Movies List Section */}
      <div className="bg-white text-black rounded-t-3xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-gray-100 rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <div className="w-full h-80 bg-black flex items-center justify-center">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="max-h-full object-contain"
                />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-center">{movie.title}</h3>
                  <p className="text-sm text-gray-700 text-center">
                    Rating: {movie.vote_average}
                  </p>
                </div>
                <Link
                  to={`/movies/${movie.id}`}
                  className="mt-3 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-12 text-sm text-gray-200 text-center">
        © 2026 Movie Booking
      </footer>
    </div>
  );
}
