import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, Search, Filter, Play } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/Firebase";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "movies"));
        const movieList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(movieList);
        setMounted(true);
      } catch (error) {
        console.error("Error fetching movies from Firestore:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // Helper function to get image URL
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
    if (path.startsWith("http") || path.startsWith("https")) return path;
    return `https://image.tmdb.org/t/p/w500${path}`;
  };

  // Filter movies
  const filteredMovies = movies.filter(movie => {
    const matchesFilter = filter === "all" || movie.status === filter;
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort by status
  const nowShowingMovies = filteredMovies.filter(m => m.status === "now_showing");
  const comingSoonMovies = filteredMovies.filter(m => m.status === "coming_soon");

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading movies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
      {/* Header */}
      <div className="relative py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
            All Movies
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Discover and book your favorite movies
          </p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <div className="relative w-full sm:w-auto flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-white/20 focus:border-yellow-400 focus:outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === "all"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("now_showing")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === "now_showing"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Now Showing
              </button>
              <button
                onClick={() => setFilter("coming_soon")}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  filter === "coming_soon"
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Now Showing Section */}
      {nowShowingMovies.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Play size={24} fill="black" className="text-black" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Now Showing</h2>
                <p className="text-gray-400">Book your tickets now</p>
              </div>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
              {nowShowingMovies.map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/10 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold text-sm flex items-center gap-1">
                      <Star size={12} fill="black" />
                      {movie.rating}
                    </div>

                    {/* Hover Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play size={28} fill="black" className="text-black ml-1" />
                      </div>
                    </div>

                    {/* Book Button */}
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
        </section>
      )}

      {/* Coming Soon Section */}
      {comingSoonMovies.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-b from-transparent via-blue-900/20 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
                <p className="text-gray-400">Get ready for these amazing movies</p>
              </div>
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-all duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
              {comingSoonMovies.map((movie, index) => (
                <Link
                  key={movie.id}
                  to={`/movies/${movie.id}`}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-400/10 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={getImageUrl(movie.poster_path)}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Duration Badge */}
                    <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {movie.duration} min
                    </div>

                    {/* Coming Soon Badge */}
                    <div className="absolute top-3 left-3 bg-orange-500/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Coming Soon
                    </div>

                    {/* Hover Content */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
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
        </section>
      )}

      {/* No Results */}
      {filteredMovies.length === 0 && (
        <div className="py-20 px-4 text-center">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filter</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setFilter("all");
            }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-sm">
            © 2026 Movie Booking. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
