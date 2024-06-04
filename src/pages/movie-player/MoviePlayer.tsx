import { useParams, useNavigate } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function MoviePlayerPage() {
  const navigate = useNavigate();

  const { movieName } = useParams();

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <video
          src={`/movies/${movieName}/${movieName}.mp4`}
          autoPlay
          controls
          style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
          onEnded={() => {
            navigate(`/`);
          }}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => navigate(`/`)} className="text-red-500">
          Exit Movie
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
