import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMovieName(name: string) {
  return name.replace(/(?!^)([A-Z])/g, " $1").trim();
}
