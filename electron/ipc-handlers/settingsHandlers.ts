import fs from "fs";
import path from "path";

const PUBLIC_PATH = path.join(__dirname, "..", "public");
const ASSETS_PATH = path.join(PUBLIC_PATH, "assets");
const IDLE_IMAGE_PATH = path.join(PUBLIC_PATH, "idleImage");

export async function changeIdleImage(_event: unknown, filePath: string) {
  try {
    const destinationPath = path.join(IDLE_IMAGE_PATH, "idle.png");
    await copyFile(filePath, destinationPath);
    console.log(`Idle image saved to ${destinationPath}`);
  } catch (error) {
    console.error("Error changing idle image:", error);
  }
}

export async function changeBackgroundAudio(_event: unknown, filePath: string) {
  try {
    const destinationPath = path.join(ASSETS_PATH, "backgroundAudio.mp3");
    await copyFile(filePath, destinationPath);
    console.log(`Background audio saved to ${destinationPath}`);
  } catch (error) {
    console.error("Error changing background audio:", error);
  }
}

async function copyFile(source: string, destination: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.copyFile(source, destination, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
