import {
  collection,
  getDocs,
  doc,
  setDoc
} from "firebase/firestore";
import { db } from "../config/Firebase";

// Movies with TMDB image paths and trailers
const MOVIES = [
  {
    id: "movie_1",
    title: "Inception",
    genre: ["Sci-Fi", "Thriller"],
    rating: 8.8,
    synopsis: "A thief who enters dream worlds to steal secrets from people's subconscious is given a chance to redeem himself by planting an idea in a target's mind.",
    duration: 148,
    status: "now_showing",
    poster_path: "/9gk7admal4BnG2iaqDXk37k6D5r.jpg",
    backdrop_path: "/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    trailer_key: "YoHD9XEInc0" // Inception trailer
  },
  {
    id: "movie_2",
    title: "The Dark Knight",
    genre: ["Action", "Drama"],
    rating: 9.0,
    synopsis: "Batman raises the stakes in his war on crime against the criminal mastermind known as the Joker who throws Gotham into chaos.",
    duration: 152,
    status: "now_showing",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdrop_path: "/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg",
    trailer_key: "EXeTwQWrcwY" // Dark Knight trailer
  },
  {
    id: "movie_3",
    title: "Interstellar",
    genre: ["Sci-Fi", "Adventure"],
    rating: 8.6,
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: 169,
    status: "coming_soon",
    poster_path: "/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop_path: "/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    trailer_key: "zSWdZVtXT7E" // Interstellar trailer
  },
  {
    id: "movie_4",
    title: "Avengers: Endgame",
    genre: ["Action", "Sci-Fi"],
    rating: 8.4,
    synopsis: "The Avengers assemble one last time to reverse Thanos' actions and restore balance to the universe.",
    duration: 181,
    status: "now_showing",
    poster_path: "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdrop_path: "/7RyHsO4yDX6MvOSc2nMRXaYjJ5s.jpg",
    trailer_key: "hA6hldpSTF8" // Endgame trailer
  },
  {
    id: "movie_5",
    title: "Parasite",
    genre: ["Thriller", "Drama"],
    rating: 8.5,
    synopsis: "A poor family schemes to become employed by a wealthy family by infiltrating their household, but their simple plan quickly becomes a complicated mess.",
    duration: 132,
    status: "now_showing",
    poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdrop_path: "/hiHGRbyTVam2S98ba3d17KbbgQh.jpg",
    trailer_key: "5xH0HfJHyaY" // Parasite trailer
  },
  {
    id: "movie_6",
    title: "Joker",
    genre: ["Crime", "Drama"],
    rating: 8.4,
    synopsis: "A troubled party clown descends into madness, becoming the architect of society's downfall.",
    duration: 122,
    status: "now_showing",
    poster_path: "/udDclJoHjfjb8Ekgsd4FDteNwTj.jpg",
    backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5woU.jpg",
    trailer_key: "zAGVQLHvwOY" // Joker trailer
  },
  {
    id: "movie_7",
    title: "Dune",
    genre: ["Sci-Fi", "Adventure"],
    rating: 8.1,
    synopsis: "A noble family becomes embroiled in war over the desert planet Arrakis, the only source of the valuable spice melange.",
    duration: 155,
    status: "coming_soon",
    poster_path: "/8RpLvcs5dXwL0Cl6SP6FwDfNYvZ.jpg",
    backdrop_path: "/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg",
    trailer_key: "8g18jFHclXk" // Dune trailer
  },
  {
    id: "movie_8",
    title: "The Matrix",
    genre: ["Sci-Fi", "Action"],
    rating: 8.7,
    synopsis: "A hacker discovers the truth about reality and joins a rebellion against the machines controlling it.",
    duration: 136,
    status: "now_showing",
    poster_path: "/f89U3ADr1oiB1s9GkdPOEpQBjQF.jpg",
    backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
    trailer_key: "vKQi3bBA1y8" // Matrix trailer
  },
  {
    id: "movie_9",
    title: "Titanic",
    genre: ["Romance", "Drama"],
    rating: 7.9,
    synopsis: "A love story aboard the doomed luxury liner that hits an iceberg on its maiden voyage.",
    duration: 195,
    status: "now_showing",
    poster_path: "/9xjZS2rlVxm8SI1ezQeQ1kQ6Jv4.jpg",
    backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
    trailer_key: "2e-eXJ6Hg4Q" // Titanic trailer
  },
  {
    id: "movie_10",
    title: "Oppenheimer",
    genre: ["Drama", "History"],
    rating: 8.9,
    synopsis: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    duration: 180,
    status: "coming_soon",
    poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop_path: "/z2yQgX5Qb4J5S2vj4YmNhYmU2ZB.jpg",
    trailer_key: "uYPbbksJxIg" // Oppenheimer trailer
  }
];

// Theatres
const THEATRES = [
  { id: "theatre_1", name: "Grand Cinema", location: "Downtown" },
  { id: "theatre_2", name: "City Plex", location: "Mall Road" },
  { id: "theatre_3", name: "IMAX Arena", location: "Tech Park" }
];

// Showtimes
const SHOWTIMES = [
  { id: "show_1", movieId: "movie_1", theatreId: "theatre_1", time: "10:30" },
  { id: "show_2", movieId: "movie_1", theatreId: "theatre_1", time: "18:45" },
  { id: "show_3", movieId: "movie_1", theatreId: "theatre_2", time: "20:30" },
  { id: "show_4", movieId: "movie_2", theatreId: "theatre_1", time: "21:00" },
  { id: "show_5", movieId: "movie_3", theatreId: "theatre_3", time: "16:30" },
  { id: "show_6", movieId: "movie_4", theatreId: "theatre_2", time: "14:00" },
  { id: "show_7", movieId: "movie_5", theatreId: "theatre_1", time: "19:15" },
  { id: "show_8", movieId: "movie_6", theatreId: "theatre_2", time: "22:00" },
  { id: "show_9", movieId: "movie_8", theatreId: "theatre_3", time: "20:45" },
  { id: "show_10", movieId: "movie_9", theatreId: "theatre_1", time: "17:00" }
];

// Generate seats
function generateSeats(showTimeId) {
  const seats = [];
  const rows = ["A","B","C","D","E","F","G","H","I","J"];

  rows.forEach(row => {
    for (let col = 1; col <= 10; col++) {
      seats.push({
        id: `${showTimeId}_seat_${row}${col}`,
        seatId: `${row}${col}`,
        status: "available",
        lockedBy: null,
        lockedAt: null,
        bookingId: null,
        type: (row === "A" || row === "B") ? "VIP" : "regular",
      });
    }
  });

  return seats;
}

// Seed Firestore - Always update movies to ensure images and trailers are present
export async function seedFirestore() {
  try {
    console.log("Starting the seeding process...");

    // Seed Movies - Always update to ensure images and trailers are present
    for (const movie of MOVIES) {
      await setDoc(doc(db, "movies", movie.id), movie);
    }
    console.log("Movies seeded...");

    // Seed Theatres
    for (const theatre of THEATRES) {
      await setDoc(doc(db, "theatres", theatre.id), theatre);
    }
    console.log("Theatres seeded...");

    // Seed Showtimes + Seats
    for (const showtime of SHOWTIMES) {
      await setDoc(doc(db, "showtimes", showtime.id), showtime);

      const seats = generateSeats(showtime.id);
      for (const seat of seats) {
        await setDoc(doc(db, "showtimes", showtime.id, "seats", seat.id), seat);
      }
    }
    console.log("Showtimes and seats seeded...");

    console.log("Seeding complete on Firebase!");
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
}
