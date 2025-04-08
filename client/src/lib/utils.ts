import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { type IssuePriority } from "@shared/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Not set";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "Not set";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return format(dateObj, "MMM dd, yyyy h:mm a");
  } catch (error) {
    console.error("Error formatting date time:", error);
    return "Invalid date";
  }
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "Not set";
  
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    // Check if date is valid
    if (isNaN(dateObj.getTime())) return "Invalid date";
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid date";
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Calculate issue priority based on vote count
export function calculatePriority(votes: number): IssuePriority {
  if (votes >= 50) return 'critical';
  if (votes >= 30) return 'high';
  if (votes >= 15) return 'medium';
  return 'low';
}

// Get priority color classes for styling
export function getPriorityColorClass(priority: IssuePriority | null | undefined): string {
  switch (priority) {
    case 'critical':
      return 'text-red-500 bg-red-100 border-red-300';
    case 'high':
      return 'text-orange-500 bg-orange-100 border-orange-300';
    case 'medium':
      return 'text-yellow-500 bg-yellow-100 border-yellow-300';
    case 'low':
      return 'text-green-500 bg-green-100 border-green-300';
    default:
      return 'text-gray-500 bg-gray-100 border-gray-300';
  }
}

// Get icon for priority
export function getPriorityIcon(priority: IssuePriority | null | undefined): string {
  switch (priority) {
    case 'critical':
      return 'ri-alarm-warning-fill';
    case 'high':
      return 'ri-arrow-up-circle-fill';
    case 'medium':
      return 'ri-arrow-right-circle-fill';
    case 'low':
      return 'ri-arrow-down-circle-fill';
    default:
      return 'ri-question-mark';
  }
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

export const DEFAULT_USER_ID = 3; // Our demo user ID
