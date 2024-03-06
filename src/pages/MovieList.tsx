import { useEffect, useState } from "react";
import MovieCard from "@/components/common/MovieCard/MovieCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ITEMS_PER_PAGE = 3; // Adjust this to display more items per page if needed

export default function MovieListPage() {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // Calculate the total number of pages
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

  useEffect(() => {
    async function fetchMovies() {
      const movieFolders = await window.electronAPI.getMovieFolders();
      setMovies(movieFolders);
    }

    fetchMovies();
  }, []);

  // Function to navigate to the next page
  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages - 1));
  };

  // Function to navigate to the previous page
  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 0));
  };

  // Calculate the movies to display on the current page
  const moviesToShow = movies.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "70rem",
          margin: "auto",
        }}
      >
        {moviesToShow.map((movieName, index) => (
          <MovieCard key={index} MovieName={movieName} MovieAgeRec="PG-13" />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <button
          onClick={prevPage}
          aria-label="Previous Page"
          style={{ cursor: "pointer", border: "none", background: "none" }}
        >
          <ArrowLeft size={24} />
        </button>
        <span style={{ margin: "0 10px" }}>
          {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          aria-label="Next Page"
          style={{ cursor: "pointer", border: "none", background: "none" }}
        >
          <ArrowRight size={24} />
        </button>
      </div>
    </>
  );
}
