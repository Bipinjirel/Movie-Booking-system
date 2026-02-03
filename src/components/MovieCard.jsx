import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold">{movie.title}</h3>
        <p className="text-sm text-gray-600">
          Release: {movie.release_date}
        </p>
        <Link
          to={`/movies/${movie.id}`}
          className="mt-3 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
