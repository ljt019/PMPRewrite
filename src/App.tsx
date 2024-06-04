import {
  useNavigate,
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MoviePlayerPage from "@/pages/movie-player/MoviePlayer";
import MovieSelect from "@/pages/movie-select/MovieSelect";
import ManageMoviesPage from "@/pages/manage-movies/ManageMovies";
import ScheduleMovies from "@/pages/schedule-movies/ScheduleMovies";
import { useEffect } from "react";

import Navbar from "@/components/common/navbar/Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.electronAPI.onNavigateToMovie((movieName) => {
      console.log(`Navigating to movie: ${movieName}`);
      navigate(`/${movieName}`);
    });
  }, [navigate]);

  return (
    <>
      <div className="flex flex-col gap-y-12">
        <Navbar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </>
  );
}

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <MovieSelect />
              </Layout>
            }
          />
          <Route
            path="/manageMovies"
            element={
              <Layout>
                <ManageMoviesPage />
              </Layout>
            }
          />
          <Route
            path="/scheduleMovies"
            element={
              <Layout>
                <ScheduleMovies />
              </Layout>
            }
          />

          <Route path="/:movieName" element={<MoviePlayerPage />} />
        </Routes>
      </Router>
    </>
  );
}
