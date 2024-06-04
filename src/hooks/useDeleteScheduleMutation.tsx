import { useMutation, useQueryClient } from "@tanstack/react-query";

async function deleteScheduledMovie(id: string) {
  window.electronAPI.deleteSchedule(id).catch((error: Error) => {
    console.error("Error in deleting movie:", error);
  });
}

export function useDeleteScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteScheduledMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}
