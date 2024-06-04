import React, { useEffect, useState } from "react";
import MovieCard from "@/components/common/movie-card/MovieCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ITEMS_PER_PAGE = 3;

export function MovieList() {
  const [movies, setMovies] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages - 1));
  };

  // Function to navigate to the previous page
  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 0));
  };

  useEffect(() => {
    async function fetchMovies() {
      const movieFolders = await window.electronAPI.getMovieFolders();
      setMovies(movieFolders);
    }

    fetchMovies();
  }, []);

  const moviesToShow = movies.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col max-w-6xl mx-auto overflow-hidden gap-y-6">
      <div className="flex-1 overflow-auto flex flex-row flex-wrap justify-center items-center gap-4">
        {moviesToShow.map((movieName, index) => (
          <MovieCard key={index} MovieName={movieName} MovieAgeRec="PG-13" />
        ))}
      </div>
      <div className="flex justify-center">
        <MovieListNavigation
          prevPage={prevPage}
          nextPage={nextPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}

function MovieListNavigation({
  prevPage,
  nextPage,
  currentPage,
  totalPages,
}: {
  prevPage: () => void;
  nextPage: () => void;
  currentPage: number;
  totalPages: number;
}) {
  return (
    <>
      <PageNavigationButton
        icon={<ArrowLeft size={24} />}
        onClick={prevPage}
        ariaLabel="Previous Page"
      />
      <CurrentPageCounter currentPage={currentPage} totalPages={totalPages} />
      <PageNavigationButton
        icon={<ArrowRight size={24} />}
        onClick={nextPage}
        ariaLabel="Next Page"
      />
    </>
  );
}

function CurrentPageCounter({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  return (
    <span className="mx-2">
      {currentPage + 1} of {totalPages}
    </span>
  );
}

function PageNavigationButton({
  icon,
  onClick,
  ariaLabel,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}) {
  return (
    <button
      className="cursor-pointer border-none bg-transparent text-muted-foreground hover:text-foreground"
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}
