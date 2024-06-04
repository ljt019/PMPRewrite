import { useQuery } from "@tanstack/react-query";
import type { Movie } from "@/types/movie";

async function fetchMovies(): Promise<Movie[] | undefined> {
  try {
    const movies = await window.electronAPI.getMovies();
    return movies;
  } catch (error) {
    console.error("Failed to fetch movies:", error);
  }
}

export function useGetMoviesQuery() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: fetchMovies,
  });
}
