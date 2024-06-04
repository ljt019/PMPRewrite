import { useEffect, useState } from "react";
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

export function ScheduledMoviesTable({
  refreshSchedule,
  scheduledMovies,
}: {
  refreshSchedule: () => void;
  scheduledMovies: { movieName: string; time: string; id: number }[];
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
              <DeleteButton
                scheduleId={schedule.id}
                refreshSchedule={refreshSchedule}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DeleteButton({
  scheduleId,
  refreshSchedule,
}: {
  scheduleId: number;
  refreshSchedule: () => void;
}) {
  const deleteScheduledMovie = async () => {
    const result = await window.electronAPI.deleteSchedule(scheduleId);
    if (result.success) {
      console.log(`Scheduled Movie deleted: ${scheduleId}`);
      refreshSchedule();
    } else {
      alert(`Failed to delete scheduled movie: ${scheduleId}`);
    }
  };

  return (
    <ActionAlertDialog onClick={deleteScheduledMovie}>
      <Button
        className="text-red-500 hover:text-red-500/70"
        variant="ghostNoHover"
      >
        <X />
      </Button>
    </ActionAlertDialog>
  );
}
