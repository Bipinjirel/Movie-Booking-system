import { useEffect, useState } from "react";
import axios from "axios";
import MovieCard from "../components/MovieCard";

export default function Movies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Example using TMDb API (replace with your own key)
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=YOUR_TMDB_API_KEY`
        );
        setMovies(res.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Popular Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
