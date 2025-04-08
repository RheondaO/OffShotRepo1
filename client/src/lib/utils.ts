import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export type CategoryIcon = 
  | "plant-line" 
  | "road-map-line" 
  | "book-open-line" 
  | "shield-star-line" 
  | "heart-pulse-line" 
  | "group-line" 
  | "government-line" 
  | "more-2-fill";

export function getCategoryIconElement(iconName: string) {
  return `ri-${iconName} text-xl text-amber-400`;
}

export const DEFAULT_USER_ID = 1;
