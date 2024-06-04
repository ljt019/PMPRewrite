import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";
import { formatMovieName } from "@/lib/utils";
import { ActionAlertDialog } from "@/components/common/ActionAlertDialog";
import { useDeleteScheduleMutation } from "@/hooks/useDeleteScheduleMutation";

import { ScheduledMovie } from "@/types/movie";

export function ScheduledMoviesTable({
  scheduledMovies,
}: {
  scheduledMovies: ScheduledMovie[];
}) {
  return (
    <Table className="text-center">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Movie Name</TableHead>
          <TableHead className="text-center">Scheduled Time</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scheduledMovies.map((schedule, index) => (
          <TableRow key={index}>
            <TableCell>{formatMovieName(schedule.movieName)}</TableCell>
            <TableCell>{schedule.time}</TableCell>
            <TableCell>
              <DeleteButton scheduleId={schedule.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DeleteButton({ scheduleId }: { scheduleId: string }) {
  const deleteScheduledMovie = useDeleteScheduleMutation();

  return (
    <ActionAlertDialog onClick={() => deleteScheduledMovie.mutate(scheduleId)}>
      <Button
        className="text-red-500 hover:text-red-500/70"
        variant="ghostNoHover"
      >
        <X />
      </Button>
    </ActionAlertDialog>
  );
}
