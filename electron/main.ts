import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "node:path";

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true, // Make sure to enable contextIsolation
      nodeIntegration: false, // Disable nodeIntegration for security
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}

// IPC handler for 'get-movie-folders'
ipcMain.handle("get-movie-folders", async () => {
  // Direct path for development mode
  const moviesDirectory = path.join(__dirname, "../public/movies");

  try {
    const directories = fs
      .readdirSync(moviesDirectory, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    return directories;
  } catch (error) {
    console.error("Failed to read movie directories:", error);
    throw error;
  }
});

ipcMain.handle(
  "save-files",
  async (
    event,
    { folderName, ageRecommendation, movieFilePath, posterFilePath }
  ) => {
    console.log(`Received request to save files for: ${folderName}`);
    // Base directory where movie folders will be saved
    const baseDirectory = path.join(__dirname, "../public/movies", folderName);
    console.log(`Base directory resolved to: ${baseDirectory}`);

    // Ensure the target directory exists
    console.log(`Checking if base directory exists...`);
    if (!fs.existsSync(baseDirectory)) {
      console.log(`Base directory does not exist. Creating...`);
      fs.mkdirSync(baseDirectory, { recursive: true });
      console.log(`Base directory created.`);
    } else {
      console.log(`Base directory already exists.`);
    }

    try {
      console.log(`Preparing to copy files...`);
      // Validate paths
      if (!movieFilePath || !posterFilePath) {
        const errorMessage =
          "Movie file path or poster file path is undefined.";
        console.error(errorMessage);
        return { status: "error", message: errorMessage };
      }

      // Define the target paths for the movie and poster files, renaming them as specified
      const targetMoviePath = path.join(baseDirectory, `${folderName}.mp4`);
      const targetPosterPath = path.join(
        baseDirectory,
        `${folderName}Poster.jpg`
      );
      console.log(`Resolved target movie path: ${targetMoviePath}`);
      console.log(`Resolved target poster path: ${targetPosterPath}`);

      // Copy the movie and poster files to the target directory, with new names
      console.log(
        `Copying movie file from ${movieFilePath} to ${targetMoviePath}`
      );
      fs.copyFileSync(movieFilePath, targetMoviePath);
      console.log(`Movie file copied successfully.`);

      console.log(
        `Copying poster file from ${posterFilePath} to ${targetPosterPath}`
      );
      fs.copyFileSync(posterFilePath, targetPosterPath);
      console.log(`Poster file copied successfully.`);

      // Save the name and age recommendation in a JSON file within the same directory, with a new name
      console.log(
        `Saving metadata to ${folderName}data.json in the base directory.`
      );
      const metaData = {
        name: folderName,
        ageRecommendation: ageRecommendation,
      };
      fs.writeFileSync(
        path.join(baseDirectory, `${folderName}data.json`),
        JSON.stringify(metaData, null, 2)
      );
      console.log(`Metadata saved successfully.`);

      return {
        status: "success",
        message: "Movie, poster, and metadata saved successfully.",
      };
    } catch (error: any) {
      console.error("Failed to save files and metadata:", error);
      return { status: "error", message: error.message };
    }
  }
);

ipcMain.handle("get-movie-data", async (event, folderName) => {
  const moviesDirectory = path.join(__dirname, "../public/movies", folderName);
  const dataPath = path.join(moviesDirectory, `${folderName}Data.json`);

  try {
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to read data for movie ${folderName}:`, error);
    return null;
  }
});

ipcMain.handle("delete-movie-folder", async (event, folderName) => {
  const folderPath = path.join(__dirname, "../public/movies", folderName);
  try {
    fs.rmdirSync(folderPath, { recursive: true });
    return { success: true };
  } catch (error) {
    console.error(`Failed to delete movie folder: ${folderName}`, error);
    return { success: false, message: error.message };
  }
});

function generateUniqueId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

ipcMain.handle("save-schedule", async (event, scheduleData) => {
  const schedulePath = path.join(__dirname, "../public/schedule.json");
  try {
    let schedules = [];
    if (fs.existsSync(schedulePath)) {
      const data = fs.readFileSync(schedulePath, "utf-8");
      schedules = JSON.parse(data);
    }

    // Add a unique ID to the schedule data
    const newSchedule = { ...scheduleData, id: generateUniqueId() };
    schedules.push(newSchedule);

    fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
    return { status: "success" };
  } catch (error) {
    console.error("Failed to save schedule:", error);
    return { status: "error", message: error.message };
  }
});

ipcMain.handle("load-schedule", async () => {
  const schedulePath = path.join(__dirname, "../public/schedule.json");
  try {
    if (fs.existsSync(schedulePath)) {
      const data = fs.readFileSync(schedulePath, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to load schedule:", error);
    return [];
  }
});

ipcMain.handle("delete-schedule", async (event, scheduleId) => {
  const schedulePath = path.join(__dirname, "../public/schedule.json");
  try {
    if (fs.existsSync(schedulePath)) {
      const data = fs.readFileSync(schedulePath, "utf-8");
      let schedules = JSON.parse(data);

      // Filter out the schedule with the matching ID
      schedules = schedules.filter((schedule) => schedule.id !== scheduleId);

      console.log(schedules);
      console.log(scheduleId);

      fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));

      // Notify renderer process to refresh
      win.webContents.send("refresh-schedule");

      return { status: "success" };
    } else {
      return { status: "error", message: "Schedule file does not exist" };
    }
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    return { status: "error", message: error.message };
  }
});

function checkSchedule() {
  const schedulePath = path.join(__dirname, "../public/schedule.json");
  if (fs.existsSync(schedulePath)) {
    const data = fs.readFileSync(schedulePath, "utf-8");
    const schedules = JSON.parse(data);
    const now = new Date();
    const currentHours = now.getHours() % 12 || 12;
    const currentMinutes = now.getMinutes().toString().padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "PM" : "AM";
    const currentTime = `${currentHours
      .toString()
      .padStart(2, "0")}:${currentMinutes} ${ampm}`;

    schedules.forEach((schedule) => {
      const [scheduledHours, scheduledMinutes, scheduledPeriod] = schedule.time
        .match(/(\d+):(\d+) (AM|PM)/)
        .slice(1);
      const normalizedScheduledTime = `${scheduledHours.padStart(
        2,
        "0"
      )}:${scheduledMinutes.padStart(2, "0")} ${scheduledPeriod}`;

      if (normalizedScheduledTime === currentTime) {
        console.log(`Navigating to movie: ${schedule.movieName}`);
        win.webContents.send("navigate-to-movie", schedule.movieName);
      }
    });
  }
}

ipcMain.handle("get-schedule", async () => {
  const schedulePath = path.join(__dirname, "../public/schedule.json");
  try {
    if (fs.existsSync(schedulePath)) {
      const data = fs.readFileSync(schedulePath, "utf-8");
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to load schedule:", error);
    throw error;
  }
});

setInterval(checkSchedule, 10000); // Check every minute

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
