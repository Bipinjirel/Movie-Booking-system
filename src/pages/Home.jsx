import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star, Calendar, Clock, Play } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase";
import { useAuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuthContext();
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch movies from Firestore
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(movieList);
      } catch (err) {
        console.error("Error fetching movies from Firestore:", err);
      }
    };
    fetchMovies();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === Math.min(4, movies.length - 1) ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, movies.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === Math.min(4, movies.length - 1) ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev === 0 ? Math.min(4, movies.length - 1) : prev - 1));
  };

  // Helper function to get image URL
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/1280x720?text=No+Image";
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `https://image.tmdb.org/t/p/original${path}`;
  };

  if (movies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* User Welcome Banner */}
      {user && (
        <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border-b border-white/10 py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Welcome back,</span>
              <span className="text-white font-semibold">{user.displayName || user.email?.split('@')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-yellow-400" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900">
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-yellow-400 text-sm font-medium">{user.email?.split('@')[0]}</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section with Slider */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {/* Background fallback gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
        
        {/* Background Images with Transitions */}
        {movies.slice(0, 5).map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
            style={{
              backgroundImage: `url(${getImageUrl(movie.backdrop_path || movie.poster_path)}),
                linear-gradient(to bottom, rgba(15,23,42,0.3), rgba(15,23,42,1))`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay"
            }}
          />
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-yellow-400/20 hover:bg-yellow-400/40 backdrop-blur-sm p-4 rounded-full transition-all duration-300 hover:scale-110 group"
        >
          <ChevronLeft size={32} className="text-white group-hover:text-yellow-400" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-yellow-400/20 hover:bg-yellow-400/40 backdrop-blur-sm p-4 rounded-full transition-all duration-300 hover:scale-110 group"
        >
          <ChevronRight size={32} className="text-white group-hover:text-yellow-400" />
        </button>

        {/* Slide Content */}
        {movies.slice(0, 5).map((movie, index) => (
          <div
            key={movie.id}
            className={`absolute inset-0 z-20 flex items-center justify-center transition-all duration-1000 ${
              index === currentIndex ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            }`}
          >
            <div className="max-w-5xl mx-auto px-4 w-full">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Movie Poster */}
                <div className="hidden lg:block transform transition-all duration-700 hover:scale-105">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-30" />
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="relative w-72 rounded-xl shadow-2xl"
                    />
                  </div>
                </div>

                {/* Movie Info */}
                <div className="text-center lg:text-left flex-1">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-4 py-1.5 rounded-full font-semibold text-sm mb-4">
                    <Star size={14} fill="black" />
                    {movie.rating} Rating
                  </div>

                  <h1 className="text-4xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
                    {movie.title}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-gray-300 mb-6">
                    <span className="flex items-center gap-1">
                      <Clock size={16} className="text-yellow-400" />
                      {movie.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} className="text-yellow-400" />
                      {movie.genre?.join(", ")}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      movie.status === "coming_soon" 
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" 
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}>
                      {movie.status === "coming_soon" ? "Coming Soon" : "Now Showing"}
                    </span>
                  </div>

                  <p className="text-gray-300 text-lg mb-8 max-w-2xl line-clamp-3">
                    {movie.synopsis}
                  </p>

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                    <Link
                      to="/movies"
                      className="group flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-3.5 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-yellow-400/25 hover:scale-105"
                    >
                      <Play size={20} className="fill-black" />
                      Book Now
                    </Link>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-105"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {[...Array(Math.min(5, movies.length))].map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentIndex 
                  ? "w-12 bg-yellow-400" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Movies Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Featured Movies
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
            </div>
            <Link
              to="/movies"
              className="text-yellow-400 hover:text-yellow-300 font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.slice(0, 5).map((movie, index) => (
              <Link
                key={movie.id}
                to={`/movies/${movie.id}`}
                className="group relative overflow-hidden rounded-xl bg-gray-800 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Poster */}
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <Play size={28} fill="black" className="text-black ml-1" />
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
                    <Star size={12} fill="black" />
                    {movie.rating}
                  </div>

                  {/* Status Badge */}
                  {movie.status === "coming_soon" && (
                    <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg font-medium text-xs">
                      Coming Soon
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 bg-gradient-to-b from-gray-800 to-gray-900">
                  <h3 className="font-bold text-white text-center truncate group-hover:text-yellow-400 transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-gray-400 text-sm text-center mt-1">
                    {movie.genre?.[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Now Showing & Coming Soon Sections */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          {/* Now Showing */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Play size={24} fill="black" className="text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Now Showing</h2>
                <p className="text-gray-400">Book your tickets now</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.filter(m => m.status === "now_showing").slice(0, 4).map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/10"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                        Book Tickets
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg truncate group-hover:text-yellow-400 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400 text-sm">{movie.genre?.[0]}</span>
                      <span className="flex items-center gap-1 text-yellow-400 text-sm font-medium">
                        <Star size={14} fill="yellow-400" />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <Calendar size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
                <p className="text-gray-400">Get ready for these amazing movies</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {movies.filter(m => m.status === "coming_soon").slice(0, 4).map((movie) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all duration-500"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {movie.duration} min
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg truncate group-hover:text-orange-400 transition-colors">
                      {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-400 text-sm">{movie.genre?.[0]}</span>
                      <span className="flex items-center gap-1 text-orange-400 text-sm font-medium">
                        <Star size={14} fill="orange-400" />
                        {movie.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            <span className="text-yellow-400">Movie</span> Booking
          </h3>
          <p className="text-gray-400 mb-6">
            Your ultimate destination for movie bookings
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <Link to="/movies" className="text-gray-400 hover:text-yellow-400 transition-colors">Movies</Link>
            <Link to="/my-bookings" className="text-gray-400 hover:text-yellow-400 transition-colors">My Bookings</Link>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Movie Booking. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
