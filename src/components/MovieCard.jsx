import { Link } from "react-router-dom";

// Helper function to get image URL
const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/300x450?text=No+Image";
  if (path.startsWith("http") || path.startsWith("https")) return path;
  return `https://image.tmdb.org/t/p/w300${path}`;
};

export default function MovieCard({ movie }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden 
                    shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
                    hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)] 
                    transition-all duration-300 
                    transform hover:-translate-y-2 hover:scale-105">
      <div className="relative overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className="w-full h-auto object-contain"
        />
        <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-lg font-bold text-sm">
          Rating: {movie.rating || movie.vote_average || "N/A"}
        </div>
        {movie.status === "coming_soon" && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-lg font-medium text-xs">
            Coming Soon
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-center text-white truncate">{movie.title}</h3>
        <p className="text-sm text-gray-300 text-center mt-1">
          {movie.genre?.join(", ") || "Drama"}
        </p>
        <Link
          to={`/movies/${movie.id}`}
          className="mt-3 inline-block bg-gradient-to-r from-purple-600 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-orange-600 w-full text-center font-medium transition-all shadow-md"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
