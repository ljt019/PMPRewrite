import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormDialog } from "@/components/common/FormDialog";
import { AlarmClockPlus } from "lucide-react";
import { AddScheduledMovieForm } from "@/pages/schedule-movies/components/AddScheduledMovieForm";
import { ScheduledMoviesTable } from "@/pages/schedule-movies/components/ScheduledMoviesTable";
import { useGetScheduleQuery } from "@/hooks/useGetScheduleQuery";

export function ScheduledMoviesCard() {
  const {
    data: schedule,
    isLoading: isScheduleLoading,
    isError: isScheduledError,
  } = useGetScheduleQuery();

  if (isScheduleLoading) {
    return (
      <div className="flex justify-center mt-[12rem] text-2xl">Loading...</div>
    );
  }

  if (isScheduledError || !schedule) {
    return (
      <div className="flex justify-center mt-[12rem] text-2xl">
        Error loading schedule
      </div>
    );
  }

  return (
    <Card className="w-[95%] rounded-[0.5rem] min-h-[35rem]">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Schedule Movies</CardTitle>
            <CardDescription>
              Schedule a movie to be played at a specific time.
            </CardDescription>
          </div>
          <div>
            <AddMovieScheduleButton />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {schedule.length === 0 ? (
          <div className="flex justify-center mt-[12rem] text-2xl">
            No movies scheduled
          </div>
        ) : (
          <ScheduledMoviesTable scheduledMovies={schedule} />
        )}
      </CardContent>
    </Card>
  );
}

function AddMovieScheduleButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <FormDialog
      title="Schedule Movie"
      Icon={<AlarmClockPlus />}
      Form={<AddScheduledMovieForm onOpenChange={setIsOpen} />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
