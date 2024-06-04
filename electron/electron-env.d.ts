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

interface SaveFilesData {
  folderName: string;
  ageRecommendation: string;
  movieFilePath: string;
  posterFilePath: string;
}

// Used in Renderer process, expose in `preload.ts`
interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  electronAPI: {
    getMovieFolders: () => Promise<string[]>;
    saveFiles: (data: SaveFilesData) => Promise<boolean>;
    getMovieData: (folderName: string) => Promise<unknown[]>;
    deleteMovieFolder: (folderName: string) => Promise<boolean>;
    saveSchedule: (scheduleData: {
      movieName: string;
      time: string;
    }) => Promise<boolean>;
    onNavigateToMovie: (callback: (movieName: string) => void) => void;
    getSchedule: () => Promise<
      { id: number; movieName: string; time: string }[]
    >;
    deleteSchedule: (scheduleId: number) => Promise<boolean>;
  };
}
