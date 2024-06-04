import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { saveScheduledMovieData } from "@/types/movie";

async function saveSchedule(data: saveScheduledMovieData) {
  window.electronAPI.saveSchedule(data).catch((error: Error) => {
    console.error("Error in saving files:", error);
  });
}

export function useSaveScheduleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });
}
