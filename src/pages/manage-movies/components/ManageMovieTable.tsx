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
import { ActionAlertDialog } from "@/components/common/ActionAlertDialog";

import type { Movie } from "@/types/movie";
import { useDeleteMovieMutation } from "@/hooks/useDeleteMovieMutation";

interface ManageMoviesTableProps {
  movies: Movie[];
}

export function ManageMoviesTable({ movies }: ManageMoviesTableProps) {
  return (
    <Table className="text-center">
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Movie Name</TableHead>
          <TableHead className="text-center">Age Rating</TableHead>
          <TableHead className="text-center">Run Time</TableHead>
          <TableHead className="text-center">Credits Start</TableHead>
          <TableHead className="text-center"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movies.map((movie, index) => (
          <TableRow key={index}>
            <TableCell>{movie.name}</TableCell>
            <TableCell>{movie.ageRecommendation}</TableCell>
            <TableCell>{movie.runTime}</TableCell>
            <TableCell>{movie.creditsStart}</TableCell>
            <TableCell>
              <DeleteButton folderName={movie.folderName} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DeleteButton({ folderName }: { folderName: Movie["folderName"] }) {
  const deleteMovie = useDeleteMovieMutation();

  return (
    <ActionAlertDialog onClick={() => deleteMovie.mutate(folderName)}>
      <Button
        className="text-red-500 hover:text-red-500/70"
        variant="ghostNoHover"
      >
        <X />
      </Button>
    </ActionAlertDialog>
  );
}
