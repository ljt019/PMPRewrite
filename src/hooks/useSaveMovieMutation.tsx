import { useMutation } from "@tanstack/react-query";

import type { saveMovieData } from "@/types/movie";

async function saveMovie(data: saveMovieData) {
  window.electronAPI.saveMovie(data).catch((error: Error) => {
    console.error("Error in saving files:", error);
    throw error;
  });
}

export function useSaveMovieMutation() {
  return useMutation({
    mutationFn: saveMovie,
  });
}
