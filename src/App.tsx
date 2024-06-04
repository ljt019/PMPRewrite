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
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { turnOnLights } from "@/light-endpoints/lights";
import useActivityDetection from "@/hooks/useActivityDetection";
import Idle from "@/pages/idle/Idle";

import Navbar from "@/components/common/navbar/Navbar";

const IDLE_TIMEOUT = 60000; // 1 minute

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isIdle, setIsIdle] = useState<boolean>(false);

  useEffect(() => {
    if (!window.electronAPI || !window.electronAPI.onNavigateToMovie) {
      console.error("electronAPI or onNavigateToMovie is not available.");
      return;
    }

    window.electronAPI.onNavigateToMovie((movieName: string) => {
      console.log(`Navigating to movie: ${movieName}`);
      navigate(`/${movieName}`);
    });
  }, [navigate]);

  useEffect(() => {
    turnOnLights();
  }, []);

  const resetIdleTimer = useCallback(() => {
    setIsIdle(false);
    clearTimeout(window.idleTimer);
    window.idleTimer = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_TIMEOUT);
  }, []);

  useActivityDetection(resetIdleTimer);

  useEffect(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    if (isIdle) {
      navigate("/idle");
    } else if (window.location.pathname === "/idle") {
      navigate("/");
    }
  }, [isIdle, navigate]);

  return (
    <>
      <div className="flex flex-col gap-y-12">
        {!isIdle && <Navbar />}
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <Router>
        <QueryClientProvider client={queryClient}>
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
            <Route
              path="/idle"
              element={
                <Layout>
                  <Idle />
                </Layout>
              }
            />
          </Routes>
        </QueryClientProvider>
      </Router>
    </>
  );
}
