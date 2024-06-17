import {
  useNavigate,
  HashRouter as Router,
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
import { useSettings } from "@/hooks/useSettings";
import { convertToMilliseconds } from "@/lib/utils";
import Navbar from "@/components/common/navbar/Navbar";
import type { Settings } from "@/types/settings";

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isIdle, setIsIdle] = useState<boolean>(false);
  const { settings, updateSettings } = useSettings();

  useEffect(() => {
    const idleTimeoutAsString = settings?.IdleTimeout;
    const lightsOnEndpointAsString = settings?.LightsOnEndpoint;
    const lightsOffEndpointAsString = settings?.LightsOffEndpoint;
    const audioTimeoutAsString = settings?.AudioTimeout;

    const newSettings: Partial<Settings> = {};

    if (!idleTimeoutAsString) {
      newSettings.IdleTimeout = "1:00";
    }

    if (!audioTimeoutAsString) {
      newSettings.AudioTimeout = "5:00";
    }

    if (!lightsOnEndpointAsString) {
      newSettings.LightsOnEndpoint = "http://192.168.1.199:8080/walkInOn";
    }

    if (!lightsOffEndpointAsString) {
      newSettings.LightsOffEndpoint = "http://192.168.1.199:8080/walkInOff";
    }

    if (Object.keys(newSettings).length > 0) {
      updateSettings(newSettings);
    }
  }, [settings, updateSettings]);

  const idleTimeout = convertToMilliseconds(settings?.IdleTimeout) || 300000;

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
    }, idleTimeout);
  }, [idleTimeout]);

  useActivityDetection(resetIdleTimer);

  useEffect(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  useEffect(() => {
    if (isIdle) {
      navigate("/idle");
    } else {
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
