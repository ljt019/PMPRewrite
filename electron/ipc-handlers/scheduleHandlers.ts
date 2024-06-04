import fs from "fs";
import path from "node:path";
import { generateUniqueId } from "../../src/lib/utils";
import type {
  ScheduledMovie,
  saveScheduledMovieData,
} from "../../src/types/movie";

export async function getScheduleData(): Promise<ScheduledMovie[]> {
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
}

export async function saveScheduleData(
  _event: unknown,
  scheduleData: saveScheduledMovieData
) {
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
    // @ts-expect-error - error
    return { status: "error", message: error.message };
  }
}

export async function deleteScheduleData(
  _event: unknown,
  scheduleId: ScheduledMovie["id"]
) {
  const schedulePath = path.join(__dirname, "../public/schedule.json");
  try {
    if (fs.existsSync(schedulePath)) {
      const data = fs.readFileSync(schedulePath, "utf-8");
      let schedules = JSON.parse(data);

      schedules = schedules.filter((schedule: ScheduledMovie) => {
        return schedule.id !== scheduleId;
      });

      fs.writeFileSync(schedulePath, JSON.stringify(schedules, null, 2));
      return { status: "success" };
    } else {
      return { status: "error", message: "Schedule file not found" };
    }
  } catch (error) {
    console.error("Failed to delete schedule:", error);
    // @ts-expect-error - error
    return { status: "error", message: error.message };
  }
}

export async function loadScheduleData() {
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
}
