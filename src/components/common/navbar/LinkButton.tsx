import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface LinkButtonProps {
  route: string;
  name: string;
}

export function LinkButton({ route, name }: LinkButtonProps) {
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
