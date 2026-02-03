import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-600 to-orange-500 text-white text-center p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Movie Booking</h1>
      <p className="text-lg mb-6">Browse movies, select seats, and book your tickets easily!</p>

      <div className="flex gap-4">
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

      <h2 className="text-2xl font-semibold mt-10 mb-4">Popular Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Replace with real API data later */}
        <div className="bg-white text-black rounded shadow p-2">Movie 1</div>
        <div className="bg-white text-black rounded shadow p-2">Movie 2</div>
        <div className="bg-white text-black rounded shadow p-2">Movie 3</div>
        <div className="bg-white text-black rounded shadow p-2">Movie 4</div>
      </div>

      <footer className="mt-12 text-sm text-gray-200">© 2026 Movie Booking</footer>
    </div>
  );
}
