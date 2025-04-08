// XP level definitions and utility functions

// Level threshold definitions
// This defines how much XP is needed to reach each level
export const XP_THRESHOLDS = [
  0,      // Level 1 (starting level) - 0 XP
  100,    // Level 2 - 100 XP
  250,    // Level 3 - 250 XP
  450,    // Level 4 - 450 XP
  700,    // Level 5 - 700 XP
  1000,   // Level 6 - 1000 XP
  1350,   // Level 7 - 1350 XP
  1750,   // Level 8 - 1750 XP
  2200,   // Level 9 - 2200 XP
  2700,   // Level 10 - 2700 XP
  3300,   // Level 11 - 3300 XP
  4000,   // Level 12 - 4000 XP
  4800,   // Level 13 - 4800 XP
  5700,   // Level 14 - 5700 XP
  6700,   // Level 15 - 6700 XP
  7800,   // Level 16 - 7800 XP
  9000,   // Level 17 - 9000 XP
  10300,  // Level 18 - 10300 XP
  11700,  // Level 19 - 11700 XP
  13200,  // Level 20 - 13200 XP
  15000,  // Level 21 - 15000 XP
  17000,  // Level 22 - 17000 XP
  19200,  // Level 23 - 19200 XP
  21600,  // Level 24 - 21600 XP
  24200,  // Level 25 - 24200 XP
  27000,  // Level 26 - 27000 XP
  30000,  // Level 27 - 30000 XP
  33200,  // Level 28 - 33200 XP
  36600,  // Level 29 - 36600 XP
  40200,  // Level 30 - 40200 XP
];

// Level titles - what each level is called
export const LEVEL_TITLES = [
  "Newcomer",           // Level 1
  "Observer",           // Level 2
  "Contributor",        // Level 3
  "Participant",        // Level 4
  "Active Member",      // Level 5
  "Dedicated Member",   // Level 6
  "Community Ally",     // Level 7
  "Community Champion", // Level 8
  "Issue Tracker",      // Level 9
  "Problem Solver",     // Level 10
  "Neighborhood Watch", // Level 11
  "Local Hero",         // Level 12
  "City Guardian",      // Level 13
  "Urban Planner",      // Level 14
  "Community Leader",   // Level 15
  "District Advocate",  // Level 16
  "Regional Influencer",// Level 17
  "Territory Expert",   // Level 18
  "Area Specialist",    // Level 19
  "Master Coordinator", // Level 20
  "Issue Sage",         // Level 21
  "Community Visionary",// Level 22
  "Strategic Director", // Level 23
  "Civic Engineer",     // Level 24
  "Policy Architect",   // Level 25
  "Sustainability Guru",// Level 26
  "Innovation Leader",  // Level 27
  "Transformation Agent",// Level 28
  "Impact Maximizer",   // Level 29
  "Community Legend"    // Level 30
];

// Level badge colors - consistent with our space theme color system
export const LEVEL_COLORS = [
  "gray",     // Level 1
  "blue",     // Level 2
  "green",    // Level 3
  "teal",     // Level 4
  "cyan",     // Level 5
  "indigo",   // Level 6
  "violet",   // Level 7
  "purple",   // Level 8
  "pink",     // Level 9
  "rose",     // Level 10
  "red",      // Level 11
  "orange",   // Level 12
  "amber",    // Level 13
  "yellow",   // Level 14
  "lime",     // Level 15
  "emerald",  // Level 16
  "blue",     // Level 17
  "sky",      // Level 18
  "violet",   // Level 19
  "gold",     // Level 20
  "purple",   // Level 21
  "fuchsia",  // Level 22
  "green",    // Level 23
  "teal",     // Level 24
  "cyan",     // Level 25
  "indigo",   // Level 26
  "pink",     // Level 27
  "rose",     // Level 28
  "amber",    // Level 29
  "gold",     // Level 30
];

// Calculate what level a user is based on their XP
export function calculateLevel(xp: number): number {
  // Default to level 1
  if (xp < XP_THRESHOLDS[1]) return 1;
  
  // Find the highest level threshold that the user's XP exceeds
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      return i + 1; // +1 because array is 0-indexed but levels are 1-indexed
    }
  }
  
  // Fallback to level 1
  return 1;
}

// Get the title for a given level
export function getLevelTitle(level: number): string {
  if (level < 1) level = 1;
  if (level > LEVEL_TITLES.length) level = LEVEL_TITLES.length;
  
  return LEVEL_TITLES[level - 1]; // -1 because array is 0-indexed but levels are 1-indexed
}

// Get the level color for a given level
export function getLevelColor(level: number): string {
  if (level < 1) level = 1;
  if (level > LEVEL_COLORS.length) level = LEVEL_COLORS.length;
  
  return LEVEL_COLORS[level - 1]; // -1 because array is 0-indexed but levels are 1-indexed
}

// Calculate XP needed for the next level
export function getXpForNextLevel(currentLevel: number): number {
  if (currentLevel < 1) currentLevel = 1;
  if (currentLevel >= XP_THRESHOLDS.length) {
    // Max level already reached, so we'll return a theoretical XP target based on growing XP pattern
    const lastThreshold = XP_THRESHOLDS[XP_THRESHOLDS.length - 1];
    const secondLastThreshold = XP_THRESHOLDS[XP_THRESHOLDS.length - 2];
    const growth = lastThreshold - secondLastThreshold;
    return lastThreshold + growth;
  }
  
  return XP_THRESHOLDS[currentLevel]; // Current level's index points to XP needed for the next level
}

// Calculate current XP needed for the current level
export function getXpForCurrentLevel(currentLevel: number): number {
  if (currentLevel <= 1) return 0;
  if (currentLevel > XP_THRESHOLDS.length) currentLevel = XP_THRESHOLDS.length;
  
  return XP_THRESHOLDS[currentLevel - 2]; // -2 because we need previous level's threshold
}

// Calculate progress percentage to next level
export function getProgressToNextLevel(currentXp: number, currentLevel: number): number {
  const xpForCurrentLevel = getXpForCurrentLevel(currentLevel);
  const xpForNextLevel = getXpForNextLevel(currentLevel);
  
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  const xpProgress = currentXp - xpForCurrentLevel;
  
  return Math.min(100, Math.max(0, (xpProgress / xpNeeded) * 100));
}

// Format XP progress display text
export function formatXpProgress(currentXp: number, currentLevel: number): string {
  const nextLevelXp = getXpForNextLevel(currentLevel);
  return `${currentXp} / ${nextLevelXp} XP`;
}

// Get XP needed to reach the next level
export function getXpRemaining(currentXp: number, currentLevel: number): number {
  const nextLevelXp = getXpForNextLevel(currentLevel);
  return Math.max(0, nextLevelXp - currentXp);
}