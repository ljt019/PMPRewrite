import { useQuery } from "@tanstack/react-query";

export function useMoviesQuery() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      try {
        const folders = await window.electronAPI.getMovieFolders();
        const moviesDataPromises = folders.map(async (folder) => {
          const data = await window.electronAPI.getMovieData(folder);
          return { ...data, folderName: folder };
        });
        const moviesData = await Promise.all(moviesDataPromises);
        return moviesData.filter(Boolean);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    },
  });
}
