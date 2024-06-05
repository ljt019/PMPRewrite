/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    DIST: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

interface Movie {
  id: string;
  name: string;
  ageRecommendation: string;
  runTime: string;
  creditsStart?: string;
  folderName: string;
  movieFilePath: string;
  posterFilePath: string;
}

interface saveMovieData {
  name: string;
  folderName: string;
  ageRecommendation: string;
  movieFilePath: string;
  posterFilePath: string;
}

interface ScheduledMovie {
  id: string;
  movieName: string;
  time: string;
}

interface saveScheduledMovieData {
  movieName: string;
  time: string;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  electronAPI: {
    // Movie Handlers
    getMovies: () => Promise<Movie[]>;
    getMovieFolders: () => Promise<Movie["folderName"][]>;
    saveMovie: (data: saveMovieData) => Promise<boolean>;
    deleteMovie: (folderName: string) => Promise<boolean>;

    // Schedule Handlers
    getSchedule: () => Promise<ScheduledMovie[]>;
    saveSchedule: (scheduleData: saveScheduledMovieData) => Promise<boolean>;
    deleteSchedule: (scheduleId: string) => Promise<boolean>;

    // Settings Handlers
    changeIdleImage: (filePath: string) => Promise<boolean>;
    changeBackgroundAudio: (filePath: string) => Promise<boolean>;

    // Call back to play movie at scheduled time
    onNavigateToMovie: (callback: (movieName: string) => void) => void;
  };
}
