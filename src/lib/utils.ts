import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMovieName(name: string) {
  return name.replace(/(?!^)([A-Z])/g, " $1").trim();
}

export function generateUniqueId() {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function convertToMilliseconds(
  time: string | null | undefined
): number | null {
  if (!time) {
    return null;
  }

  const [minutes, seconds] = time.split(":").map(Number);
  return (minutes * 60 + seconds) * 1000;
}
