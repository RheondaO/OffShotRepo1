import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  issues, type Issue, type InsertIssue,
  votes, type Vote, type InsertVote
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Issues
  getAllIssues(): Promise<Issue[]>;
  getIssueById(id: number): Promise<Issue | undefined>;
  createIssue(issue: InsertIssue): Promise<Issue>;
  updateIssue(id: number, issue: Partial<InsertIssue>): Promise<Issue | undefined>;
  getIssuesByCategory(categoryId: number): Promise<Issue[]>;
  getFeaturedIssues(): Promise<Issue[]>;
  getTrendingIssues(): Promise<Issue[]>;
  searchIssues(query: string): Promise<Issue[]>;
  
  // Votes
  getVotesByIssue(issueId: number): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  removeVote(issueId: number, userId: number): Promise<boolean>;
  hasUserVoted(issueId: number, userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private issues: Map<number, Issue>;
  private votes: Map<number, Vote>;
  
  private userId: number;
  private categoryId: number;
  private issueId: number;
  private voteId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.issues = new Map();
    this.votes = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.issueId = 1;
    this.voteId = 1;
    
    // Add some initial categories
    this.initializeData();
  }

  private initializeData() {
    const categories = [
      { name: "Environment", icon: "plant-line", description: "Environmental issues and initiatives" },
      { name: "Infrastructure", icon: "road-map-line", description: "Roads, buildings, and public infrastructure" },
      { name: "Education", icon: "book-open-line", description: "Schools, learning programs, and educational resources" },
      { name: "Public Safety", icon: "shield-star-line", description: "Safety and security concerns" },
      { name: "Health", icon: "heart-pulse-line", description: "Health services and wellness initiatives" },
      { name: "Community", icon: "group-line", description: "Community building and social events" },
      { name: "Governance", icon: "government-line", description: "Local governance and policy issues" },
      { name: "Other", icon: "more-2-fill", description: "Other community issues" }
    ];

    categories.forEach(cat => {
      this.createCategory({
        name: cat.name,
        icon: cat.icon,
        description: cat.description
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null 
    };
    this.categories.set(id, category);
    return category;
  }

  // Issue methods
  async getAllIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values());
  }

  async getIssueById(id: number): Promise<Issue | undefined> {
    return this.issues.get(id);
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const id = this.issueId++;
    const now = new Date();
    const issue: Issue = { 
      ...insertIssue, 
      id, 
      location: insertIssue.location || null,
      createdAt: now, 
      votes: 0, 
      comments: 0, 
      status: "open",
      isFeatured: false
    };
    this.issues.set(id, issue);
    return issue;
  }

  async updateIssue(id: number, updatedFields: Partial<InsertIssue>): Promise<Issue | undefined> {
    const issue = this.issues.get(id);
    if (!issue) return undefined;
    
    const updatedIssue = { ...issue, ...updatedFields };
    this.issues.set(id, updatedIssue);
    return updatedIssue;
  }

  async getIssuesByCategory(categoryId: number): Promise<Issue[]> {
    return Array.from(this.issues.values()).filter(
      (issue) => issue.categoryId === categoryId
    );
  }

  async getFeaturedIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values())
      .filter(issue => issue.isFeatured)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 6);
  }

  async getTrendingIssues(): Promise<Issue[]> {
    return Array.from(this.issues.values())
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 5);
  }

  async searchIssues(query: string): Promise<Issue[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.issues.values()).filter(
      (issue) => 
        issue.title.toLowerCase().includes(lowercaseQuery) || 
        issue.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Vote methods
  async getVotesByIssue(issueId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      (vote) => vote.issueId === issueId
    );
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    const id = this.voteId++;
    const now = new Date();
    const vote: Vote = { ...insertVote, id, createdAt: now };
    this.votes.set(id, vote);
    
    // Update issue vote count
    const issue = this.issues.get(insertVote.issueId);
    if (issue) {
      issue.votes += 1;
      this.issues.set(issue.id, issue);
    }
    
    return vote;
  }

  async removeVote(issueId: number, userId: number): Promise<boolean> {
    const voteEntry = Array.from(this.votes.values()).find(
      (vote) => vote.issueId === issueId && vote.userId === userId
    );
    
    if (!voteEntry) return false;
    
    this.votes.delete(voteEntry.id);
    
    // Update issue vote count
    const issue = this.issues.get(issueId);
    if (issue) {
      issue.votes = Math.max(0, issue.votes - 1);
      this.issues.set(issue.id, issue);
    }
    
    return true;
  }

  async hasUserVoted(issueId: number, userId: number): Promise<boolean> {
    return Array.from(this.votes.values()).some(
      (vote) => vote.issueId === issueId && vote.userId === userId
    );
  }
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Issue methods
  async getAllIssues(): Promise<Issue[]> {
    return await db.select().from(issues);
  }

  async getIssueById(id: number): Promise<Issue | undefined> {
    const [issue] = await db.select().from(issues).where(eq(issues.id, id));
    return issue;
  }

  async createIssue(insertIssue: InsertIssue): Promise<Issue> {
    const [issue] = await db.insert(issues).values({
      ...insertIssue,
      location: insertIssue.location || null,
      status: "open", 
      votes: 0,
      comments: 0,
      isFeatured: false
    }).returning();
    return issue;
  }

  async updateIssue(id: number, updatedFields: Partial<InsertIssue>): Promise<Issue | undefined> {
    const [issue] = await db
      .update(issues)
      .set(updatedFields)
      .where(eq(issues.id, id))
      .returning();
    return issue;
  }

  async getIssuesByCategory(categoryId: number): Promise<Issue[]> {
    return await db
      .select()
      .from(issues)
      .where(eq(issues.categoryId, categoryId));
  }

  async getFeaturedIssues(): Promise<Issue[]> {
    return await db
      .select()
      .from(issues)
      .where(eq(issues.isFeatured, true))
      .orderBy(desc(issues.votes))
      .limit(6);
  }

  async getTrendingIssues(): Promise<Issue[]> {
    return await db
      .select()
      .from(issues)
      .orderBy(desc(issues.votes))
      .limit(5);
  }

  async searchIssues(query: string): Promise<Issue[]> {
    return await db
      .select()
      .from(issues)
      .where(
        or(
          like(issues.title, `%${query}%`),
          like(issues.description, `%${query}%`)
        )
      );
  }

  // Vote methods
  async getVotesByIssue(issueId: number): Promise<Vote[]> {
    return await db
      .select()
      .from(votes)
      .where(eq(votes.issueId, issueId));
  }

  async createVote(insertVote: InsertVote): Promise<Vote> {
    // Create the vote
    const [vote] = await db.insert(votes).values(insertVote).returning();
    
    // Get current issue
    const [issue] = await db
      .select()
      .from(issues)
      .where(eq(issues.id, insertVote.issueId));
    
    if (issue) {
      // Update the issue vote count
      await db
        .update(issues)
        .set({ votes: issue.votes + 1 })
        .where(eq(issues.id, insertVote.issueId));
    }
    
    return vote;
  }

  async removeVote(issueId: number, userId: number): Promise<boolean> {
    // First check if vote exists
    const [voteExists] = await db
      .select()
      .from(votes)
      .where(and(
        eq(votes.issueId, issueId),
        eq(votes.userId, userId)
      ));
    
    if (!voteExists) return false;
    
    // Delete the vote
    await db
      .delete(votes)
      .where(and(
        eq(votes.issueId, issueId),
        eq(votes.userId, userId)
      ));
    
    // Get current issue
    const [issue] = await db
      .select()
      .from(issues)
      .where(eq(issues.id, issueId));
    
    if (issue) {
      // Update the issue vote count
      await db
        .update(issues)
        .set({ votes: Math.max(0, issue.votes - 1) })
        .where(eq(issues.id, issueId));
    }
    
    return true;
  }

  async hasUserVoted(issueId: number, userId: number): Promise<boolean> {
    const [vote] = await db
      .select()
      .from(votes)
      .where(and(
        eq(votes.issueId, issueId),
        eq(votes.userId, userId)
      ));
    
    return !!vote;
  }
  
  // Helper to initialize sample data if needed
  async initializeData() {
    // Check if categories exist
    const existingCategories = await this.getAllCategories();
    
    if (existingCategories.length === 0) {
      const categories = [
        { name: "Environment", icon: "plant-line", description: "Environmental issues and initiatives" },
        { name: "Infrastructure", icon: "road-map-line", description: "Roads, buildings, and public infrastructure" },
        { name: "Education", icon: "book-open-line", description: "Schools, learning programs, and educational resources" },
        { name: "Public Safety", icon: "shield-star-line", description: "Safety and security concerns" },
        { name: "Health", icon: "heart-pulse-line", description: "Health services and wellness initiatives" },
        { name: "Community", icon: "group-line", description: "Community building and social events" },
        { name: "Governance", icon: "government-line", description: "Local governance and policy issues" },
        { name: "Other", icon: "more-2-fill", description: "Other community issues" }
      ];

      for (const cat of categories) {
        await this.createCategory({
          name: cat.name,
          icon: cat.icon,
          description: cat.description
        });
      }
    }
  }
}

export const storage = new DatabaseStorage();
