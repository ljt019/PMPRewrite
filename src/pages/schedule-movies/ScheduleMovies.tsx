import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormDialog } from "@/components/common/FormDialog";
import { AlarmClockPlus } from "lucide-react";
import { AddScheduledMovieForm } from "@/components/common/AddScheduledMovieForm";
import { ScheduledMoviesTable } from "@/components/common/ScheduledMoviesTable";
import { useState, useEffect } from "react";

export default function ScheduleMovies() {
  return (
    <div className="flex justify-center">
      <ScheduleMoviesCard />
    </div>
  );
}

interface ScheduledMovie {
  movieName: string;
  time: string;
  id: number;
}

function ScheduleMoviesCard() {
  const [scheduledMovies, setScheduledMovies] = useState<ScheduledMovie[]>([]);

  useEffect(() => {
    fetchScheduledMovies();
  }, []);

  async function fetchScheduledMovies() {
    const scheduleData = await window.electronAPI.getSchedule();
    setScheduledMovies(scheduleData);
  }

  function refreshSchedule() {
    fetchScheduledMovies();
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
            <AddMovieScheduleButton refreshSchedule={refreshSchedule} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScheduledMoviesTable scheduledMovies={scheduledMovies} />
      </CardContent>
    </Card>
  );
}

function AddMovieScheduleButton({
  refreshSchedule,
}: {
  refreshSchedule: () => void;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <FormDialog
      title="Schedule Movie"
      Icon={<AlarmClockPlus />}
      Form={
        <AddScheduledMovieForm
          refreshSchedule={refreshSchedule}
          onOpenChange={setIsOpen}
        />
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
