import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMinutesRemaining(targetTime: string): number {
  // targetTime format: "HH:mm" e.g. "11:30"
  const [targetHour, targetMin] = targetTime.split(":").map(Number);

  const now = new Date();
  const target = new Date();
  target.setHours(targetHour, targetMin, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  return diffMin; // negative if already passed
}
