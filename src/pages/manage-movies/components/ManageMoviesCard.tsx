import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FilePlus } from "lucide-react";
import { FormDialog } from "@/components/common/FormDialog";
import { ManageMoviesTable } from "@/pages/manage-movies/components/ManageMovieTable";
import AddMovieForm from "@/components/common/AddMovieForm";
import { useState } from "react";

import type { Movie } from "@/types/movie";

interface ManageMoviesCardProps {
  movies: Movie[];
  refreshMovies: () => void;
}

export function ManageMoviesCard({
  movies,
  refreshMovies,
}: ManageMoviesCardProps) {
  return (
    <Card className="w-[95%] rounded-[0.5rem] min-h-[35rem]">
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>Manage Movies</CardTitle>
            <CardDescription>
              Add, edit, or delete movies from the movie library.
            </CardDescription>
          </div>
          <div>
            <AddMovieButton refreshMovies={refreshMovies} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ManageMoviesTable movies={movies} refreshMovies={refreshMovies} />
      </CardContent>
    </Card>
  );
}

function AddMovieButton({ refreshMovies }: { refreshMovies: () => void }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <FormDialog
      title={"Add Movie"}
      Icon={<FilePlus />}
      Form={
        <AddMovieForm refreshMovies={refreshMovies} onOpenChange={setIsOpen} />
      }
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
