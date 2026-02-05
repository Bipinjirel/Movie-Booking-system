import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Fetch movies from TMDb Discover API
  useEffect(() => {
    fetch("https://api.themoviedb.org/3/discover/movie?api_key=80d491707d8cf7b38aa19c7ccab0952f")
      .then((res) => res.json())
      .then((data) => {
        console.log("TMDb results:", data.results);
        setMovies(data.results || []);
      })
      .catch((err) => console.error("Error fetching movies:", err));
  }, []);

  // ✅ Auto-slide every 5 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === 4 ? 0 : prev + 1)); // cycle through first 5 movies
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === 4 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? 4 : prev - 1));
  };

  if (movies.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-yellow-500 font-bold">
        Loading Movies...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col text-white">
      {/* ✅ Hero Sliding Banner */}
      <section className="h-[70vh] w-full relative overflow-hidden group">
        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full border border-white/10 text-white hover:text-yellow-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={40} />
        </button>

        {movies.slice(0, 5).map((movie, index) => {
          // ✅ Ensure we always have a valid image
          const imagePath = movie.backdrop_path || movie.poster_path;
          const bgImage = imagePath
            ? `https://image.tmdb.org/t/p/original${imagePath}`
            : "https://image.tmdb.org/t/p/w1280/8YFL5QQVPy3AgrEQxNYVSgiPEbe.jpg"; // fallback

          return (
            <div
              key={movie.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{
                backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.7), transparent), url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="flex flex-col items-center justify-center text-center h-full px-6 relative z-10">
                <h1 className="text-5xl font-extrabold mb-4">{movie.title}</h1>
                <p className="text-lg mb-8 max-w-2xl">{movie.overview}</p>
                <div className="flex gap-6 justify-center">
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
            </div>
          );
        })}

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-3 rounded-full border border-white/10 text-white hover:text-yellow-500 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={40} />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`h-1.5 transition-all duration-500 ${
                i === currentIndex ? "w-12 bg-yellow-400" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

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
