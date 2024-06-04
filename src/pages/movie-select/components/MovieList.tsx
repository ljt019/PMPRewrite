import React, { useState } from "react";
import MovieCard from "@/pages/movie-select/components/MovieCard";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useGetMoviesQuery } from "@/hooks/useGetMoviesQuery";
import { Card } from "@/components/ui/card";

const ITEMS_PER_PAGE = 3;

export function MovieList() {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: movies,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
  } = useGetMoviesQuery();

  if (isMoviesLoading) {
    return (
      <div className="flex justify-center mt-[12rem] text-2xl">Loading...</div>
    );
  }

  if (isMoviesError || !movies) {
    return (
      <div className="flex justify-center mt-[12rem] text-2xl">
        Error loading movies
      </div>
    );
  }

  const moviesToShow = movies.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col max-w-6xl mx-auto overflow-hidden gap-y-6">
      <div className="flex-1 overflow-auto flex flex-row flex-wrap justify-center items-center gap-4">
        {moviesToShow.length === 0 ? (
          <div className="flex justify-center text-2xl gap-4">
            <Card className="flex items-center justify-center w-[17rem] h-[28rem]">
              <div className="text-2xl">No movies added</div>
            </Card>
            <Card className="flex items-center justify-center w-[17rem] h-[28rem]">
              <div className="text-2xl">No movies added</div>
            </Card>
            <Card className="flex items-center justify-center w-[17rem] h-[28rem]">
              <div className="text-2xl">No movies added</div>
            </Card>
          </div>
        ) : (
          moviesToShow.map((movie, index) => (
            <MovieCard key={index} {...movie} />
          ))
        )}
      </div>
      <div className="flex justify-center">
        <MovieListNavigation
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          movies={movies}
        />
      </div>
    </div>
  );
}

interface MovieListNavigationProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
  movies: unknown[];
}

function MovieListNavigation({
  setCurrentPage,
  currentPage,
  movies,
}: MovieListNavigationProps) {
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);

  const nextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages - 1));
  };

  // Function to navigate to the previous page
  const prevPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 0));
  };

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
