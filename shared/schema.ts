import { pgTable, text, serial, integer, timestamp, boolean, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues),
  votes: many(votes),
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

// Insert schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
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

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertIssue = z.infer<typeof insertIssueSchema>;
export type Issue = typeof issues.$inferSelect;

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type Vote = typeof votes.$inferSelect;
