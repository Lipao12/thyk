import { type ClassValue, clsx } from "clsx";
import { addDays } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*export function formatDate(date: Date | string | null | undefined, lang: string): string {
  //const {t, i18n} = useTranslation("utils")
  if (!date) return "No date";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formattedDate = dateObj.toLocaleDateString(lang==="pt"?"pt-BR":"en-US", {
    weekday: "long",
    day: "2-digit", 
    month: "short",  
    year: "numeric", 
  });
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  /*if (isToday(dateObj)) {
    return `Today - ${format(dateObj, "MMM dd, yyyy")}`;
  } else if (isTomorrow(dateObj)) {
    return `Tomorrow - ${format(dateObj, "MMM dd, yyyy")}`;
  } else {
    return format(dateObj, "MMM dd, yyyy");
  }
}*/

export function formatDate(date: Date | string | Timestamp | null | undefined, lang: string): string {
  if (!date) return "No date";

  let dateObj: Date;

  if (date instanceof Timestamp) {
    dateObj = date.toDate();
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  const formattedDate = dateObj.toLocaleDateString(lang === "pt" ? "pt-BR" : "en-US", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}


export function formatTime(date: Date | string | Timestamp | null | undefined, lang: string): string {
  if (!date) return "";

  let dateObj: Date;

  if (date instanceof Timestamp) {
    dateObj = date.toDate();
  } else if (typeof date === "string") {
    dateObj = new Date(date);
  } else {
    dateObj = date;
  }

  return dateObj.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang !== "pt",
  });
}


/*export function formatTime(date: Date | string | null | undefined, lang:string): string {
  if (!date) return "";
  
  const dateObj = typeof date === "string" ? new Date(date) : date;

 return dateObj.toLocaleTimeString(lang === "pt" ? "pt-BR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: lang !== "pt",
  });
}*/

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
