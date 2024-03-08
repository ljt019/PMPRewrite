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

interface MovieCardProps {
  MovieName: string;
  MovieAgeRec: string;
}

export default function MovieCard({ MovieName, MovieAgeRec }: MovieCardProps) {
  return (
    <Card style={{ minWidth: "20rem" }} className="rounded-xl">
      <CardHeader className="text-center pb-3 pt-3">
        <CardTitle className="pb-2">
          <MovieTitle MovieName={MovieName} />
        </CardTitle>
        <div className="flex justify-between">
          <Badge className="w-14">{MovieAgeRec}</Badge>
          <MovieInfoHover MovieName={MovieName} MovieAgeRec={MovieAgeRec} />
        </div>
      </CardHeader>
      <CardContent className="w-full pb-3">
        <MovieImage MovieName={MovieName} />
      </CardContent>
      <CardFooter className="flex justify-center pb-2">
        <WatchNowButton MovieName={MovieName} />
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
    <div style={{ height: "20rem" }}>
      <img
        src={`/movies/${MovieName}/${MovieName}Poster.jpg`}
        alt={MovieName}
        className="object-fill w-full h-full"
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
    <Button variant="rounded" onClick={() => navigate(`/${MovieName}`)}>
      Watch Now!
    </Button>
  );
}

interface MovieInfoHoverProps {
  MovieName: string;
  MovieAgeRec: string;
}

export function MovieInfoHover({
  MovieName,
  MovieAgeRec,
}: MovieInfoHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info />
      </HoverCardTrigger>
      <HoverCardContent>
        <p>Movie Name: {MovieName}</p>
        <p>Movie Age Recommendation: {MovieAgeRec}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
