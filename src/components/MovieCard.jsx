import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden 
                    shadow-[0_4px_20px_rgba(0,0,0,0.4)] 
                    hover:shadow-[0_8px_30px_rgba(0,0,0,0.6)] 
                    transition-transform duration-300 
                    transform hover:-translate-y-2">
      <img
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-auto object-contain"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-center">{movie.title}</h3>
        <p className="text-sm text-gray-600 text-center">
          Rating: {movie.vote_average}
        </p>
      </div>
    </div>
  );
}

