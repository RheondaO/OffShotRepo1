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
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
});

export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  categoryId: integer("category_id").notNull(),
  userId: integer("user_id").notNull(),
  location: text("location"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  votes: integer("votes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues),
  votes: many(votes),
  createdTags: many(tags, { relationName: "userCreatedTags" }),
  userNfts: many(userNfts),
  userActivities: many(userActivities),
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
  votes: many(votes),
  issueTags: many(issueTags),
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

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  name: true,
  email: true,
  password: true,
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
  })
  .extend({
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(2000),
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
