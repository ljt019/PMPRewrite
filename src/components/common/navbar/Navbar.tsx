import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import AudioPlayer from "@/components/common/BackgroundAudioPlayer";

export default function Navbar() {
  return (
    <>
      <div className="grid grid-cols-3">
        <div></div>
        <div className="flex justify-center">
          <LinkButton route="/" name="Play Movies" />
          <LinkButton route="/scheduleMovies" name="Schedule Movies" />
          <LinkButton route="/manageMovies" name="Manage Movies" />
        </div>
        <div className="flex justify-end pt-2 pr-3">
          <AudioPlayer />
        </div>
      </div>
    </>
  );
}

interface LinkButtonProps {
  route: string;
  name: string;
}

function LinkButton({ route, name }: LinkButtonProps) {
  // Navigate to the specified route
  const navigate = useNavigate();

  const Navigate = (route: string) => {
    navigate(route);
  };

  // Highlight the active route
  const location = useLocation();

  const isActive = () => {
    return location.pathname === route;
  };

  return (
    <Button
      onClick={() => Navigate(route)}
      className={`hover:underline ${
        isActive() ? "text-foreground underline" : "text-muted-foreground"
      }`}
      variant="link"
    >
      {name}
    </Button>
  );
}
