import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMovieName } from "@/lib/utils";
import { X } from "lucide-react";
import { ActionAlertDialog } from "@/components/common/ActionAlertDialog";

import type { Movie } from "@/types/movie";

interface ManageMoviesTableProps {
  movies: Movie[];
  refreshMovies: () => void;
}

export function ManageMoviesTable({
  movies,
  refreshMovies,
}: ManageMoviesTableProps) {
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
            <TableCell>{formatMovieName(movie.name)}</TableCell>
            <TableCell>{movie.ageRecommendation}</TableCell>
            <TableCell>{movie.runTime}</TableCell>
            <TableCell>{movie.creditsStart}</TableCell>
            <TableCell>
              <DeleteButton
                folderName={movie.folderName}
                refreshMovies={refreshMovies}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DeleteButton({
  folderName,
  refreshMovies,
}: {
  folderName: Movie["folderName"];
  refreshMovies: () => void;
}) {
  const deleteMovie = async () => {
    const result = await window.electronAPI.deleteMovieFolder(folderName);
    if (result.success) {
      console.log(`Movie folder deleted: ${folderName}`);
      refreshMovies();
    } else {
      alert(`Failed to delete movie folder: ${folderName}`);
    }
  };

  return (
    <ActionAlertDialog onClick={deleteMovie}>
      <Button
        className="text-red-500 hover:text-red-500/70"
        variant="ghostNoHover"
      >
        <X />
      </Button>
    </ActionAlertDialog>
  );
}
