import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Example posters (replace with real API images later)
  const movies = [
    { id: 1, title: "Movie 1", poster: "https://via.placeholder.com/300x400?text=Movie+1" },
    { id: 2, title: "Movie 2", poster: "https://via.placeholder.com/300x400?text=Movie+2" },
    { id: 3, title: "Movie 3", poster: "https://via.placeholder.com/300x400?text=Movie+3" },
    { id: 4, title: "Movie 4", poster: "https://via.placeholder.com/300x400?text=Movie+4" },
  ];

  const [index, setIndex] = useState(0);

  const nextMovie = () => {
    setIndex((prev) => (prev + 1) % movies.length);
  };

  const prevMovie = () => {
    setIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-purple-600 to-orange-500 text-white text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Movie Booking</h1>
      <p className="text-lg mb-6">Browse movies, select seats, and book your tickets easily!</p>

      <div className="flex gap-4 mb-8">
        <Link
          to="/movies"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500"
        >
          Book Now
        </Link>
        <Link
          to="/locations"
          className="bg-green-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-500"
        >
          See Locations
        </Link>
      </div>

      {/* ✅ Big Poster Slider */}
      <h2 className="text-2xl font-semibold mb-4">Popular Movies</h2>
      <div className="flex items-center gap-6">
        {/* Left Arrow */}
        <button
          onClick={prevMovie}
          className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 text-2xl"
        >
          ◀
        </button>

        {/* Poster */}
        <div className="bg-white rounded shadow-lg p-4">
          <img
            src={movies[index].poster}
            alt={movies[index].title}
            className="w-72 h-96 object-cover rounded"
          />
          <h3 className="text-black font-semibold mt-2">{movies[index].title}</h3>
        </div>

        {/* Right Arrow */}
        <button
          onClick={nextMovie}
          className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 text-2xl"
        >
          ▶
        </button>
      </div>

      <footer className="mt-12 text-sm text-gray-200">© 2026 Movie Booking</footer>
    </div>
  );
}
