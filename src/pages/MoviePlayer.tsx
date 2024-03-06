import { useParams, useNavigate } from "react-router-dom";

export default function MoviePlayerPage() {
  const navigate = useNavigate();

  const { movieName } = useParams();

  return (
    <video
      src={`/movies/${movieName}/${movieName}.mp4`}
      autoPlay
      controls
      style={{ width: "100vw", height: "100vh", objectFit: "cover" }}
      onEnded={() => {
        navigate(`/`);
      }}
    />
  );
}
