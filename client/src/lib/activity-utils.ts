// Mapping from activity IDs to activity names
export const activityNames: Record<number, string> = {
  1: "Commented on an issue",
  2: "Replied to a comment",
  3: "Submitted a new issue",
  4: "Voted on an issue",
  5: "Shared an issue",
  6: "Added a tag",
  7: "Logged in",
  8: "Signed up",
  9: "Joined a mission",
  10: "Completed a daily quest",
  11: "Reached a new level",
  12: "Started a game",
  13: "Won a game",
  14: "Subscribed to newsletter",
  15: "Purchased an NFT",
  16: "Assigned an issue",
  17: "Stole an issue",
  18: "Resolved an issue",
  19: "Maintained login streak",
  20: "Upload Profile Photo"
};

// Mapping from activity IDs to icon names
export const activityIcons: Record<number, string> = {
  1: "message-square", // Comment
  2: "reply",         // Reply
  3: "file-plus",     // Submit issue
  4: "heart",         // Vote
  5: "share",         // Share
  6: "tag",           // Add tag
  7: "log-in",        // Login
  8: "user-plus",     // Signup
  9: "users",         // Join mission
  10: "check-square", // Daily quest
  11: "award",        // Level up
  12: "play",         // Start game
  13: "trophy",       // Win game
  14: "mail",         // Newsletter
  15: "image",        // NFT
  16: "clipboard",    // Assign issue
  17: "scissors",     // Steal issue
  18: "check-circle", // Resolve issue
  19: "flame",        // Login streak
  20: "image"         // Profile Photo
};

// Get a readable activity name from an ID
export const getActivityName = (activityId: number): string => {
  return activityNames[activityId] || `Activity ${activityId}`;
};

// Get an icon name for an activity
export const getActivityIcon = (activityId: number): string => {
  return activityIcons[activityId] || "activity";
};

// Get a color class for an activity (for UI styling)
export const getActivityColor = (activityId: number): string => {
  // Map activity IDs to specific color classes
  const colorMap: Record<number, string> = {
    1: "blue",    // Comment - blue
    2: "blue",    // Reply - blue
    3: "green",   // Submit issue - green
    4: "pink",    // Vote - pink
    5: "orange",  // Share - orange
    6: "purple",  // Add tag - purple
    7: "sky",     // Login - sky
    8: "indigo",  // Signup - indigo
    9: "violet",  // Join mission - violet
    10: "amber",  // Daily quest - amber
    11: "gold",   // Level up - gold
    12: "lime",   // Start game - lime
    13: "emerald", // Win game - emerald
    14: "cyan",   // Newsletter - cyan
    15: "fuchsia", // NFT - fuchsia
    16: "teal",   // Assign issue - teal
    17: "red",    // Steal issue - red
    18: "green",  // Resolve issue - green
    19: "orange", // Login streak - orange
    20: "blue"    // Profile Photo - blue
  };
  
  return colorMap[activityId] || "gray";
};

// Format XP for display with + sign
export const formatXp = (xp: number): string => {
  return xp >= 0 ? `+${xp} XP` : `${xp} XP`;
};

// Group activities by date
export function groupActivitiesByDate<T extends { performedAt: string | Date }>(activities: T[]): Record<string, T[]> {
  return activities.reduce((groups, activity) => {
    const date = new Date(activity.performedAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, T[]>);
}

// Sort dates in descending order (most recent first)
export function getSortedDates<T>(dateGroups: Record<string, T[]>): string[] {
  return Object.keys(dateGroups).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
}