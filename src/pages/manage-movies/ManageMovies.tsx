import { useState, useEffect } from "react";
import { ManageMoviesCard } from "@/pages/manage-movies/components/ManageMoviesCard";

import type { Movie } from "@/types/movie";

export default function ManageMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const folders = await window.electronAPI.getMovieFolders();
      const moviesDataPromises = folders.map(async (folder) => {
        const data = await window.electronAPI.getMovieData(folder);
        return { ...data, folderName: folder };
      });
      const moviesData = await Promise.all(moviesDataPromises);

      // @ts-expect-error - Filter out any null values
      setMovies(moviesData.filter(Boolean));
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  const refreshMovies = () => {
    fetchMovies();
  };

  return (
    <div>
      <div className="flex justify-center">
        <ManageMoviesCard movies={movies} refreshMovies={refreshMovies} />
      </div>
    </div>
  );
}
