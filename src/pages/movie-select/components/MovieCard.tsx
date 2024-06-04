import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types/movie";

export default function MovieCard(movie: Movie) {
  return (
    <Card style={{ minWidth: "20rem" }} className="rounded-xl">
      <CardHeader className="text-center pb-3 pt-3">
        <CardTitle className="pb-2">
          <MovieTitle MovieName={movie.name} />
        </CardTitle>
        <div className="flex justify-between">
          <Badge className="flex min-w-[2rem] cursor-default hover:bg-primary max-h-[1.25rem]">
            {movie.ageRecommendation}
          </Badge>
          <MovieInfoHover
            MovieName={movie.name}
            MovieAgeRec={movie.ageRecommendation}
            RunTime={movie.runTime}
          />
        </div>
      </CardHeader>
      <CardContent className="w-full pb-3">
        <MovieImage MovieName={movie.folderName} />
      </CardContent>
      <CardFooter className="flex justify-center pb-2">
        <WatchNowButton MovieName={movie.folderName} />
      </CardFooter>
    </Card>
  );
}

interface MovieTitleProps {
  MovieName: string;
}

export function MovieTitle({ MovieName }: MovieTitleProps) {
  const formatMovieName = (name: string) => {
    return name.replace(/([A-Z])/g, " $1").trim();
  };

  return <CardTitle>{formatMovieName(MovieName)}</CardTitle>;
}

interface MovieImageProps {
  MovieName: string;
}

export function MovieImage({ MovieName }: MovieImageProps) {
  return (
    <div className="h-[20rem] border border-accent rounded-[0.5rem]">
      <img
        src={`/movies/${MovieName}/${MovieName}Poster.jpg`}
        alt={MovieName}
        className="object-fill w-full h-full rounded-[0.5rem]"
      />
    </div>
  );
}

interface WatchNowButtonProps {
  MovieName: string;
}

export function WatchNowButton({ MovieName }: WatchNowButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      className="rounded-[0.5rem] text-black"
      onClick={() => navigate(`/${MovieName}`)}
    >
      Watch Now
    </Button>
  );
}

interface MovieInfoHoverProps {
  MovieName: string;
  MovieAgeRec: string;
  RunTime: string;
}

export function MovieInfoHover({
  MovieName,
  MovieAgeRec,
  RunTime,
}: MovieInfoHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="text-muted-foreground hover:text-foreground">
        <Info />
      </HoverCardTrigger>
      <HoverCardContent className="rounded-[0.5rem]">
        <p className="text-lg">{MovieName}</p>
        <p className="text-sm text-muted-foreground">
          Age Rating: {MovieAgeRec}
        </p>
        <p className="text-sm text-muted-foreground">Run Time: {RunTime}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
