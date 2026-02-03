import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-orange-500 text-white text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Movie Booking</h1>
      <p className="text-lg mb-6">Browse movies, select seats, and book your tickets easily!</p>
      <Link
        to="/movies"
        className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500"
      >
        Explore Movies
      </Link>
    </div>
  );
}
