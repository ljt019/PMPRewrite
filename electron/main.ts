import { app, BrowserWindow } from "electron";
import fs from "fs";
import path from "node:path";
import "./ipc-handlers/ipcHandlers";

console.log("main running");

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

export let win: BrowserWindow | null;
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

  win.setMenuBarVisibility(true);

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

//setInterval(checkSchedule, 30000); // Check every minute

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
