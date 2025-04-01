import { type ClassValue, clsx } from "clsx";
import { addDays, format, isToday, isTomorrow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "No date";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  if (isToday(dateObj)) {
    return `Today - ${format(dateObj, "MMM dd, yyyy")}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow - ${format(dateObj, "MMM dd, yyyy")}`;
  } else {
    return format(dateObj, "MMM dd, yyyy");
  }
}

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "h:mm a");
}

export function getTimeframeRange(timeframe: string): { start: Date; end: Date } {
  const today = new Date();
  
  switch (timeframe) {
    case "daily":
      return { start: today, end: today };
    case "weekly":
      return {
        start: today,
        end: addDays(today, 6)
      };
    case "monthly":
      return {
        start: today,
        end: addDays(today, 30)
      };
    default:
      return { start: today, end: today };
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "#FF5722"; // Primary color
    case "medium":
      return "#FFC107"; // Warning color
    case "low":
      return "#4CAF50"; // Accent color
    default:
      return "#757575"; // Default gray
  }
}

export function getCategoryColor(color: string | undefined): string {
  return color || "#2196F3"; // Default to secondary color
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}
