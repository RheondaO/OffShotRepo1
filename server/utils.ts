import { type IssuePriority, ISSUE_PRIORITY } from "@shared/schema";

/**
 * Calculate issue priority based on vote count
 * 
 * @param votes Number of votes on an issue
 * @returns Priority level as a string (low, medium, high, critical)
 */
export function calculateIssuePriority(votes: number): IssuePriority {
  if (votes >= 50) return 'critical' as const;
  if (votes >= 30) return 'high' as const;
  if (votes >= 15) return 'medium' as const;
  return 'low' as const;
}