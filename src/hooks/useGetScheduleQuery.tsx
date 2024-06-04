import { useQuery } from "@tanstack/react-query";
import { ScheduledMovie } from "@/types/movie";

async function fetchSchedule(): Promise<ScheduledMovie[] | undefined> {
  try {
    const scheduleData = await window.electronAPI.getSchedule();
    return scheduleData;
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
  }
}

export function useGetScheduleQuery() {
  return useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
  });
}
