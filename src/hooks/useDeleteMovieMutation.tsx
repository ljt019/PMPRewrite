import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteMovie(folderName: string) {
  window.electronAPI.deleteMovie(folderName).catch((error: Error) => {
    console.error("Error in deleting movie:", error);
  });
}

export function useDeleteMovieMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
