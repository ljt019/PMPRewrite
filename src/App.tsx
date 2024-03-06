import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MoviePlayerPage from "@/pages/MoviePlayer";
import MovieListPage from "@/pages/MovieList";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MovieListPage />} />
          <Route path="/:movieName" element={<MoviePlayerPage />} />
        </Routes>
      </Router>
    </>
  );
}
