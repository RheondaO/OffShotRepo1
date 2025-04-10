import { pgTable, text, serial, integer, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  photoUrl: text("photo_url"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastLoginAt: timestamp("last_login_at"),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
});

// Define issue status and assignment timeframes
export const ISSUE_STATUS = ['open', 'assigned', 'in_progress', 'resolved', 'closed'] as const;
export type IssueStatus = typeof ISSUE_STATUS[number];

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  userId: integer("user_id").notNull(), // Creator of the issue
  assignedTo: integer("assigned_to"), // User assigned to the issue
  location: text("location"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  votes: integer("votes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  priority: text("priority").notNull().default("low"),
  assignedAt: timestamp("assigned_at"), // When the issue was assigned
  expectedCompletionAt: timestamp("expected_completion_at"), // Deadline for completing the issue
  lastActivityAt: timestamp("last_activity_at"), // Timestamp of the last activity on the issue
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by").notNull(),
});

export const issueTags = pgTable("issue_tags", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  tagId: integer("tag_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by").notNull(),
});

// Define priority levels for issues based on vote counts
export const ISSUE_PRIORITY = ['low', 'medium', 'high', 'critical'] as const;
export type IssuePriority = typeof ISSUE_PRIORITY[number];

// Define rarity type enum for NFTs
export const NFT_RARITY = ['common', 'rare', 'epic', 'legendary'] as const;
export type NftRarity = typeof NFT_RARITY[number];

export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  supply: integer("supply").notNull().default(1),
  remainingSupply: integer("remaining_supply").notNull().default(1),
  price: integer("price").notNull(), // Price in XP
  rarity: text("rarity").notNull(), // common, rare, epic, legendary
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const userNfts = pgTable("user_nfts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  nftId: integer("nft_id").notNull(),
  acquiredAt: timestamp("acquired_at").notNull().defaultNow(),
  tokenId: text("token_id").notNull(), // Unique identifier for this instance of the NFT
});

export const xpActivities = pgTable("xp_activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  cooldownMinutes: integer("cooldown_minutes").notNull().default(0), // 0 means no cooldown
});

export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityId: integer("activity_id").notNull(),
  performedAt: timestamp("performed_at").notNull().defaultNow(),
  xpEarned: integer("xp_earned").notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  interests: text("interests").array(),
  subscribedAt: timestamp("subscribed_at").notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

// Track issue assignment history, including steals
export const issueAssignmentHistory = pgTable("issue_assignment_history", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  assigneeId: integer("assignee_id").notNull(), // User assigned to the issue
  assignerId: integer("assigner_id").notNull(), // User who assigned/stole the issue (can be the same as assigneeId for self-assignments)
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
  expectedCompletionAt: timestamp("expected_completion_at").notNull(),
  isStolen: boolean("is_stolen").notNull().default(false), // Whether the issue was stolen from another user
  previousAssigneeId: integer("previous_assignee_id"), // Only set when the issue is stolen
  stealReason: text("steal_reason"), // Reason for stealing the issue
  xpRewarded: integer("xp_rewarded"), // XP rewarded for completing the issue (set when completed)
  completedAt: timestamp("completed_at"), // When the issue was completed (null if not completed)
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues), // Issues created by the user
  assignedIssues: many(issues, { relationName: "assignedIssues" }), // Issues assigned to the user
  votes: many(votes),
  createdTags: many(tags, { relationName: "userCreatedTags" }),
  userNfts: many(userNfts),
  userActivities: many(userActivities),
  comments: many(comments), // Comments made by the user
  // Issue assignment history relations
  assignedHistories: many(issueAssignmentHistory, { relationName: "assignedHistories" }),
  assignerHistories: many(issueAssignmentHistory, { relationName: "assignerHistories" }),
  previousAssigneeHistories: many(issueAssignmentHistory, { relationName: "previousAssigneeHistories" }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  issues: many(issues),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
  category: one(categories, {
    fields: [issues.categoryId],
    references: [categories.id]
  }),
  user: one(users, {
    fields: [issues.userId],
    references: [users.id]
  }),
  assignee: one(users, {
    fields: [issues.assignedTo],
    references: [users.id],
    relationName: "assignedIssues"
  }),
  votes: many(votes),
  issueTags: many(issueTags),
  assignmentHistory: many(issueAssignmentHistory),
  comments: many(comments),
}));

export const votesRelations = relations(votes, ({ one }) => ({
  issue: one(issues, {
    fields: [votes.issueId],
    references: [issues.id]
  }),
  user: one(users, {
    fields: [votes.userId],
    references: [users.id]
  }),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  creator: one(users, {
    fields: [tags.createdBy],
    references: [users.id],
    relationName: "userCreatedTags"
  }),
  issueTags: many(issueTags),
}));

export const issueTagsRelations = relations(issueTags, ({ one }) => ({
  issue: one(issues, {
    fields: [issueTags.issueId],
    references: [issues.id]
  }),
  tag: one(tags, {
    fields: [issueTags.tagId],
    references: [tags.id]
  }),
  createdByUser: one(users, {
    fields: [issueTags.createdBy],
    references: [users.id]
  }),
}));

export const nftsRelations = relations(nfts, ({ many }) => ({
  userNfts: many(userNfts),
}));

export const userNftsRelations = relations(userNfts, ({ one }) => ({
  user: one(users, {
    fields: [userNfts.userId],
    references: [users.id]
  }),
  nft: one(nfts, {
    fields: [userNfts.nftId],
    references: [nfts.id]
  }),
}));

export const xpActivitiesRelations = relations(xpActivities, ({ many }) => ({
  userActivities: many(userActivities),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id]
  }),
  activity: one(xpActivities, {
    fields: [userActivities.activityId],
    references: [xpActivities.id]
  }),
}));

export const issueAssignmentHistoryRelations = relations(issueAssignmentHistory, ({ one }) => ({
  issue: one(issues, {
    fields: [issueAssignmentHistory.issueId],
    references: [issues.id]
  }),
  assignee: one(users, {
    fields: [issueAssignmentHistory.assigneeId],
    references: [users.id],
    relationName: "assignedHistories"
  }),
  assigner: one(users, {
    fields: [issueAssignmentHistory.assignerId],
    references: [users.id],
    relationName: "assignerHistories"
  }),
  previousAssignee: one(users, {
    fields: [issueAssignmentHistory.previousAssigneeId],
    references: [users.id],
    relationName: "previousAssigneeHistories"
  }),
}));

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  name: true,
  email: true,
  password: true,
  photoUrl: true,
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  icon: true,
  description: true,
});

export const insertIssueSchema = createInsertSchema(issues)
  .pick({
    title: true,
    description: true,
    categoryId: true,
    userId: true,
    location: true,
    priority: true,
  })
  .extend({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(2000),
    priority: z.enum(ISSUE_PRIORITY).default('low'),
  });

// Schema for updating issues with all possible fields
export const updateIssueSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(2000).optional(),
  categoryId: z.number().int().positive().optional(),
  status: z.enum(ISSUE_STATUS).optional(),
  priority: z.enum(ISSUE_PRIORITY).optional(),
  location: z.string().nullable().optional(),
  assignedTo: z.number().int().positive().nullable().optional(),
  assignedAt: z.date().nullable().optional(),
  expectedCompletionAt: z.date().nullable().optional(),
  lastActivityAt: z.date().nullable().optional(),
  isFeatured: z.boolean().optional(),
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  issueId: true,
  userId: true,
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  description: true,
  createdBy: true,
}).extend({
  name: z.string().min(2).max(30),
});

export const insertIssueTagSchema = createInsertSchema(issueTags).pick({
  issueId: true,
  tagId: true,
  createdBy: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type UpdateIssue = z.infer<typeof updateIssueSchema>;
export type Issue = typeof issues.$inferSelect;

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export const insertNftSchema = createInsertSchema(nfts).pick({
  name: true,
  description: true,
  imageUrl: true,
  supply: true,
  remainingSupply: true,
  price: true,
  rarity: true,
}).extend({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(500),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
});

export const insertUserNftSchema = createInsertSchema(userNfts).pick({
  userId: true,
  nftId: true,
  tokenId: true,
});

export const insertXpActivitySchema = createInsertSchema(xpActivities).pick({
  name: true,
  description: true,
  xpReward: true,
  cooldownMinutes: true,
}).extend({
  name: z.string().min(3).max(50),
  description: z.string().min(10).max(200),
});

export const insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  activityId: true,
  xpEarned: true,
  performedAt: true,
});

export type InsertIssueTag = z.infer<typeof insertIssueTagSchema>;
export type IssueTag = typeof issueTags.$inferSelect;

export type InsertNft = z.infer<typeof insertNftSchema>;
export type Nft = typeof nfts.$inferSelect;

export type InsertUserNft = z.infer<typeof insertUserNftSchema>;
export type UserNft = typeof userNfts.$inferSelect;

export type InsertXpActivity = z.infer<typeof insertXpActivitySchema>;
export type XpActivity = typeof xpActivities.$inferSelect;

export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
export type UserActivity = typeof userActivities.$inferSelect;

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  name: true,
  email: true,
  interests: true,
}).extend({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  interests: z.array(z.string()).min(1),
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

// Assignment and stealing schemas
export const assignIssueSchema = z.object({
  issueId: z.number(),
  userId: z.number(),
  expectedDays: z.number().min(1).max(30).default(7), // Default deadline is 7 days
});

export const stealIssueSchema = z.object({
  issueId: z.number(),
  userId: z.number(), // New assignee
  reason: z.string().min(10).max(500),
});

export type AssignIssue = z.infer<typeof assignIssueSchema>;
export type StealIssue = z.infer<typeof stealIssueSchema>;

export const insertIssueAssignmentHistorySchema = createInsertSchema(issueAssignmentHistory)
  .pick({
    issueId: true,
    assigneeId: true,
    assignerId: true,
    expectedCompletionAt: true,
    isStolen: true,
    previousAssigneeId: true,
    stealReason: true,
  });

export type InsertIssueAssignmentHistory = z.infer<typeof insertIssueAssignmentHistorySchema>;
export type IssueAssignmentHistory = typeof issueAssignmentHistory.$inferSelect;

// Comment system
export const debates = pgTable("debates", {
  id: serial("id").primaryKey(),
  topic: text("topic").notNull(),
  scheduledFor: timestamp("scheduled_for").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  createdBy: integer("created_by").notNull(),
  status: text("status").notNull().default("scheduled"), // scheduled, active, completed, cancelled
  roomId: text("room_id").notNull().unique() // For WebSocket room identification
});

export const debateParticipants = pgTable("debate_participants", {
  id: serial("id").primaryKey(),
  debateId: integer("debate_id").notNull(),
  userId: integer("user_id").notNull(),
  role: text("role").notNull().default("participant"), // moderator, participant
  joinedAt: timestamp("joined_at").notNull().defaultNow()
});

export const debatesRelations = relations(debates, ({ one, many }) => ({
  creator: one(users, {
    fields: [debates.createdBy],
    references: [users.id]
  }),
  participants: many(debateParticipants)
}));

export const debateParticipantsRelations = relations(debateParticipants, ({ one }) => ({
  debate: one(debates, {
    fields: [debateParticipants.debateId],
    references: [debates.id]
  }),
  user: one(users, {
    fields: [debateParticipants.userId],
    references: [users.id]
  })
}));

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  issueId: integer("issue_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  parentId: integer("parent_id"), // For threaded comments/replies
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  isEdited: boolean("is_edited").notNull().default(false)
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
  issue: one(issues, {
    fields: [comments.issueId],
    references: [issues.id]
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id]
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id]
  }),
  replies: many(comments, { relationName: "replies" })
}));

// Update issue relations to include comments
export const insertCommentSchema = createInsertSchema(comments)
  .pick({
    issueId: true,
    userId: true,
    content: true,
    parentId: true,
  })
  .extend({
    content: z.string().min(1).max(2000),
  });

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

export const insertDebateSchema = createInsertSchema(debates).pick({
  topic: true,
  scheduledFor: true,
  location: true,
  createdBy: true,
}).extend({
  topic: z.string().min(5).max(200),
  scheduledFor: z.coerce.date(),
  location: z.string().optional()
});

export const insertDebateParticipantSchema = createInsertSchema(debateParticipants).pick({
  debateId: true,
  userId: true,
  role: true
});

export type InsertDebate = z.infer<typeof insertDebateSchema>;
export type Debate = typeof debates.$inferSelect;
export type InsertDebateParticipant = z.infer<typeof insertDebateParticipantSchema>;
export type DebateParticipant = typeof debateParticipants.$inferSelect;
