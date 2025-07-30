import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getRelativeDate(timestamp) {
  const inputDate = new Date(timestamp);
  const now = new Date();

  // Normalize both dates to midnight for day comparison
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfInput = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate()
  );

  const ONE_DAY = 1000 * 60 * 60 * 24;
  const diffInDays = Math.round((startOfToday - startOfInput) / ONE_DAY);

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else {
    return `${diffInDays} days ago`;
  }
}
