// client/src/lib/mockData.ts

export const MOCK_DATA = {
  issues: [
    {
      id: 101,
      title: "Main Street Pothole Repair",
      description: "Deep pothole near 5th Avenue causing major traffic delays.",
      category: "Infrastructure",
      priority: "critical",
      status: "in_progress",
      votes: 42,
      author: "Jane Doe",
      createdAt: new Date().toISOString(),
    },
    {
      id: 102,
      title: "Community Solar Panel Proposal",
      description: "Proposal to install solar panels on public school roofs.",
      category: "Environment",
      priority: "medium",
      status: "open",
      votes: 28,
      author: "Alex Smith",
      createdAt: new Date().toISOString(),
    },
  ],
  
  leaderboard: [
    { id: 1, username: "EcoWarrior99", xp: 1450, rank: 1 },
    { id: 2, username: "CivicLeader", xp: 1200, rank: 2 },
  ],

  notifications: [
    { id: 1, title: "New Vote", message: "Someone voted on your issue.", read: false },
  ],
};
