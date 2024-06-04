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
import AddMovieForm from "@/pages/manage-movies/components/AddMovieForm";
import { useState } from "react";
import { useGetMoviesQuery } from "@/hooks/useGetMoviesQuery";

export function ManageMoviesCard() {
  const {
    data: movies,
    isLoading: isMoviesLoading,
    isError: isMoviesError,
  } = useGetMoviesQuery();

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
            <AddMovieButton />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isMoviesLoading ? (
          <div className="flex justify-center mt-[12rem] text-2xl">
            Loading...
          </div>
        ) : isMoviesError || !movies ? (
          <div className="flex justify-center mt-[12rem] text-2xl">
            Error loading movie data
          </div>
        ) : movies.length === 0 ? (
          <div className="flex justify-center mt-[12rem] text-2xl">
            No movies added
          </div>
        ) : (
          <ManageMoviesTable movies={movies} />
        )}
      </CardContent>
    </Card>
  );
}

function AddMovieButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <FormDialog
      title={"Add Movie"}
      Icon={<FilePlus />}
      Form={<AddMovieForm onOpenChange={setIsOpen} />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    />
  );
}
