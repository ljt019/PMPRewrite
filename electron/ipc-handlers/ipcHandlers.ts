import { ipcMain } from "electron";
import {
  getMoviesData,
  getMovieFolders,
  deleteMovieFolder,
  saveMovieFiles,
} from "./movieHandlers";

import {
  getScheduleData,
  saveScheduleData,
  deleteScheduleData,
  loadScheduleData,
} from "./scheduleHandlers";

// Movie Handlers
ipcMain.handle("get-movies", getMoviesData);
ipcMain.handle("get-movie-folders", getMovieFolders);
ipcMain.handle("save-movie", saveMovieFiles);
ipcMain.handle("delete-movie", deleteMovieFolder);

// Schedule Handlers
ipcMain.handle("get-schedule", getScheduleData);
ipcMain.handle("save-schedule", saveScheduleData);
ipcMain.handle("delete-schedule", deleteScheduleData);

// Not exposed to render used internally to play movies on schedule
ipcMain.handle("load-schedule", loadScheduleData);
