import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  issues, type Issue, type InsertIssue,
  votes, type Vote, type InsertVote,
  tags, type Tag, type InsertTag,
  issueTags, type IssueTag, type InsertIssueTag,
  nfts, type Nft, type InsertNft,
  userNfts, type UserNft, type InsertUserNft,
  xpActivities, type XpActivity, type InsertXpActivity,
  userActivities, type UserActivity, type InsertUserActivity,
  newsletterSubscribers, type NewsletterSubscriber, type InsertNewsletterSubscriber
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, and, or, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserXp(userId: number, xpAmount: number): Promise<User | undefined>;
  getUserLevel(userId: number): Promise<number>;

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
  getVotesByUser(userId: number): Promise<Vote[]>;
  createVote(vote: InsertVote): Promise<Vote>;
  removeVote(issueId: number, userId: number): Promise<boolean>;
  hasUserVoted(issueId: number, userId: number): Promise<boolean>;
  
  // Tags
  getAllTags(): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  searchTags(query: string): Promise<Tag[]>;
  
  // Issue Tags
  getTagsByIssue(issueId: number): Promise<Tag[]>;
  addTagToIssue(issueTag: InsertIssueTag): Promise<IssueTag>;
  removeTagFromIssue(issueId: number, tagId: number): Promise<boolean>;
  getIssuesByTag(tagId: number): Promise<Issue[]>;
  
  // NFT methods
  getAllNfts(): Promise<Nft[]>;
  getNftById(id: number): Promise<Nft | undefined>;
  createNft(nft: InsertNft): Promise<Nft>;
  getUserNfts(userId: number): Promise<UserNft[]>;
  purchaseNft(userNft: InsertUserNft): Promise<UserNft | undefined>;
  
  // XP Activity methods
  getAllXpActivities(): Promise<XpActivity[]>;
  getXpActivityById(id: number): Promise<XpActivity | undefined>;
  createXpActivity(activity: InsertXpActivity): Promise<XpActivity>;
  recordUserActivity(userActivity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: number): Promise<UserActivity[]>;
  checkActivityEligibility(userId: number, activityId: number): Promise<boolean>;
  
  // Newsletter subscribers
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private issues: Map<number, Issue>;
  private votes: Map<number, Vote>;
  private tags: Map<number, Tag>;
  private issueTags: Map<number, IssueTag>;
  private nfts: Map<number, Nft>;
  private userNfts: Map<number, UserNft>;
  private xpActivities: Map<number, XpActivity>;
  private userActivities: Map<number, UserActivity>;
  private newsletterSubscribers: Map<number, NewsletterSubscriber>;
  
  private userId: number;
  private categoryId: number;
  private issueId: number;
  private voteId: number;
  private tagId: number;
  private issueTagId: number;
  private nftId: number;
  private userNftId: number;
  private xpActivityId: number;
  private userActivityId: number;
  private newsletterSubscriberId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.issues = new Map();
    this.votes = new Map();
    this.tags = new Map();
    this.issueTags = new Map();
    this.nfts = new Map();
    this.userNfts = new Map();
    this.xpActivities = new Map();
    this.userActivities = new Map();
    this.newsletterSubscribers = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.issueId = 1;
    this.voteId = 1;
    this.tagId = 1;
    this.issueTagId = 1;
    this.nftId = 1;
    this.userNftId = 1;
    this.xpActivityId = 1;
    this.userActivityId = 1;
    this.newsletterSubscriberId = 1;
    
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
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      xp: 0,
      level: 1,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserXp(userId: number, xpAmount: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    // Add XP to user
    const updatedXp = user.xp + xpAmount;
    
    // Calculate level (every 1000 XP is a level up)
    const updatedLevel = Math.max(1, Math.floor(updatedXp / 1000) + 1);
    
    const updatedUser = { 
      ...user, 
      xp: updatedXp,
      level: updatedLevel
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async getUserLevel(userId: number): Promise<number> {
    const user = this.users.get(userId);
    if (!user) return 1; // Default level
    return user.level;
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
  
  async getVotesByUser(userId: number): Promise<Vote[]> {
    return Array.from(this.votes.values()).filter(
      (vote) => vote.userId === userId
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

  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return Array.from(this.tags.values());
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.tagId++;
    const now = new Date();
    const tag: Tag = { 
      ...insertTag, 
      id, 
      createdAt: now, 
      description: insertTag.description || null 
    };
    this.tags.set(id, tag);
    return tag;
  }

  async searchTags(query: string): Promise<Tag[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tags.values()).filter(
      (tag) => 
        tag.name.toLowerCase().includes(lowercaseQuery) || 
        (tag.description && tag.description.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Issue Tags methods
  async getTagsByIssue(issueId: number): Promise<Tag[]> {
    const issueTagIds = Array.from(this.issueTags.values())
      .filter(issueTag => issueTag.issueId === issueId)
      .map(issueTag => issueTag.tagId);
    
    return Array.from(this.tags.values())
      .filter(tag => issueTagIds.includes(tag.id));
  }

  async addTagToIssue(insertIssueTag: InsertIssueTag): Promise<IssueTag> {
    const id = this.issueTagId++;
    const now = new Date();
    const issueTag: IssueTag = { ...insertIssueTag, id, createdAt: now };
    this.issueTags.set(id, issueTag);
    return issueTag;
  }

  async removeTagFromIssue(issueId: number, tagId: number): Promise<boolean> {
    const issueTagEntry = Array.from(this.issueTags.values()).find(
      (issueTag) => issueTag.issueId === issueId && issueTag.tagId === tagId
    );
    
    if (!issueTagEntry) return false;
    
    this.issueTags.delete(issueTagEntry.id);
    return true;
  }

  async getIssuesByTag(tagId: number): Promise<Issue[]> {
    const issueIds = Array.from(this.issueTags.values())
      .filter(issueTag => issueTag.tagId === tagId)
      .map(issueTag => issueTag.issueId);
    
    return Array.from(this.issues.values())
      .filter(issue => issueIds.includes(issue.id));
  }
  
  // NFT methods
  async getAllNfts(): Promise<Nft[]> {
    return Array.from(this.nfts.values());
  }
  
  async getNftById(id: number): Promise<Nft | undefined> {
    return this.nfts.get(id);
  }
  
  async createNft(insertNft: InsertNft): Promise<Nft> {
    const id = this.nftId++;
    const now = new Date();
    const nft: Nft = {
      ...insertNft,
      id,
      createdAt: now,
      supply: insertNft.supply ?? 1,
      remainingSupply: insertNft.remainingSupply ?? insertNft.supply ?? 1
    };
    this.nfts.set(id, nft);
    return nft;
  }
  
  async getUserNfts(userId: number): Promise<UserNft[]> {
    return Array.from(this.userNfts.values())
      .filter(userNft => userNft.userId === userId);
  }
  
  async purchaseNft(insertUserNft: InsertUserNft): Promise<UserNft | undefined> {
    // Check if NFT exists
    const nft = this.nfts.get(insertUserNft.nftId);
    if (!nft) return undefined;
    
    // Check if user exists
    const user = this.users.get(insertUserNft.userId);
    if (!user) return undefined;
    
    // Check if NFT is still available
    if (nft.remainingSupply <= 0) return undefined;
    
    // Check if user has enough XP
    if (user.xp < nft.price) return undefined;
    
    // Process the purchase
    const id = this.userNftId++;
    const now = new Date();
    const userNft: UserNft = {
      ...insertUserNft,
      id,
      acquiredAt: now
    };
    
    // Update user's XP
    this.updateUserXp(user.id, -nft.price);
    
    // Decrease NFT supply
    const updatedNft = { ...nft, remainingSupply: nft.remainingSupply - 1 };
    this.nfts.set(nft.id, updatedNft);
    
    // Record ownership
    this.userNfts.set(id, userNft);
    
    return userNft;
  }
  
  // XP Activity methods
  async getAllXpActivities(): Promise<XpActivity[]> {
    return Array.from(this.xpActivities.values());
  }
  
  async getXpActivityById(id: number): Promise<XpActivity | undefined> {
    return this.xpActivities.get(id);
  }
  
  async createXpActivity(insertXpActivity: InsertXpActivity): Promise<XpActivity> {
    const id = this.xpActivityId++;
    const activity: XpActivity = { 
      ...insertXpActivity, 
      id,
      cooldownMinutes: insertXpActivity.cooldownMinutes ?? 0
    };
    this.xpActivities.set(id, activity);
    return activity;
  }
  
  async recordUserActivity(insertUserActivity: InsertUserActivity): Promise<UserActivity> {
    const id = this.userActivityId++;
    const now = new Date();
    const userActivity: UserActivity = {
      ...insertUserActivity,
      id,
      performedAt: now
    };
    this.userActivities.set(id, userActivity);
    
    // Also update the user's XP
    this.updateUserXp(insertUserActivity.userId, insertUserActivity.xpEarned);
    
    return userActivity;
  }
  
  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId);
  }
  
  async checkActivityEligibility(userId: number, activityId: number): Promise<boolean> {
    // Get the activity to check its cooldown period
    const activity = this.xpActivities.get(activityId);
    if (!activity) return false;
    
    // If there's no cooldown, always eligible
    if (activity.cooldownMinutes === 0) return true;
    
    // Find the user's most recent activity of this type
    const userActivities = await this.getUserActivities(userId);
    const matchingActivities = userActivities.filter(
      ua => ua.activityId === activityId
    );
    
    if (matchingActivities.length === 0) return true; // No previous activity, eligible
    
    // Find the most recent activity of this type
    const mostRecent = matchingActivities.reduce((latest, current) => {
      return current.performedAt > latest.performedAt ? current : latest;
    }, matchingActivities[0]);
    
    // Check if cooldown period has passed
    const cooldownMs = activity.cooldownMinutes * 60 * 1000;
    const now = new Date();
    const timeSinceLastActivity = now.getTime() - mostRecent.performedAt.getTime();
    
    return timeSinceLastActivity >= cooldownMs;
  }
  
  // Newsletter subscriber methods
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }
  
  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    return Array.from(this.newsletterSubscribers.values()).find(
      (subscriber) => subscriber.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const id = this.newsletterSubscriberId++;
    const now = new Date();
    const subscriber: NewsletterSubscriber = {
      ...insertSubscriber,
      id,
      subscribedAt: now,
      isActive: true
    };
    this.newsletterSubscribers.set(id, subscriber);
    return subscriber;
  }
  
  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const subscriber = await this.getNewsletterSubscriberByEmail(email);
    if (!subscriber) return false;
    
    const updatedSubscriber = { ...subscriber, isActive: false };
    this.newsletterSubscribers.set(subscriber.id, updatedSubscriber);
    return true;
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
    // When creating a new user, ensure the XP fields are properly initialized
    const [user] = await db.insert(users).values({
      ...insertUser,
      xp: 0,
      level: 1
    }).returning();
    return user;
  }
  
  async updateUserXp(userId: number, xpAmount: number): Promise<User | undefined> {
    // Get current user
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) return undefined;
    
    // Calculate new XP and level
    const updatedXp = user.xp + xpAmount;
    const updatedLevel = Math.max(1, Math.floor(updatedXp / 1000) + 1);
    
    // Update user
    const [updatedUser] = await db
      .update(users)
      .set({ 
        xp: updatedXp,
        level: updatedLevel
      })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
  }
  
  async getUserLevel(userId: number): Promise<number> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
      
    return user?.level || 1; // Default to level 1 if user not found
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
  
  async getVotesByUser(userId: number): Promise<Vote[]> {
    return await db
      .select()
      .from(votes)
      .where(eq(votes.userId, userId));
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
  
  // Tag methods
  async getAllTags(): Promise<Tag[]> {
    return await db.select().from(tags);
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    const [tag] = await db.select().from(tags).where(eq(tags.id, id));
    return tag;
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const [tag] = await db.insert(tags).values({
      ...insertTag,
      description: insertTag.description || null
    }).returning();
    return tag;
  }

  async searchTags(query: string): Promise<Tag[]> {
    return await db
      .select()
      .from(tags)
      .where(
        or(
          like(tags.name, `%${query}%`),
          like(tags.description, `%${query}%`)
        )
      );
  }

  // Issue Tags methods
  async getTagsByIssue(issueId: number): Promise<Tag[]> {
    return await db
      .select({
        id: tags.id,
        name: tags.name,
        description: tags.description,
        createdAt: tags.createdAt,
        createdBy: tags.createdBy
      })
      .from(tags)
      .innerJoin(issueTags, eq(issueTags.tagId, tags.id))
      .where(eq(issueTags.issueId, issueId));
  }

  async addTagToIssue(insertIssueTag: InsertIssueTag): Promise<IssueTag> {
    const [issueTag] = await db
      .insert(issueTags)
      .values(insertIssueTag)
      .returning();
    return issueTag;
  }

  async removeTagFromIssue(issueId: number, tagId: number): Promise<boolean> {
    await db
      .delete(issueTags)
      .where(and(
        eq(issueTags.issueId, issueId),
        eq(issueTags.tagId, tagId)
      ));
    
    // Since we can't easily check rows affected, just check if the relation still exists
    const [existingRelation] = await db
      .select()
      .from(issueTags)
      .where(and(
        eq(issueTags.issueId, issueId),
        eq(issueTags.tagId, tagId)
      ));
    
    return !existingRelation;
  }

  async getIssuesByTag(tagId: number): Promise<Issue[]> {
    return await db
      .select({
        id: issues.id,
        title: issues.title,
        description: issues.description,
        categoryId: issues.categoryId,
        userId: issues.userId,
        location: issues.location,
        createdAt: issues.createdAt,
        votes: issues.votes,
        comments: issues.comments,
        status: issues.status,
        isFeatured: issues.isFeatured
      })
      .from(issues)
      .innerJoin(issueTags, eq(issueTags.issueId, issues.id))
      .where(eq(issueTags.tagId, tagId));
  }
  
  // NFT methods
  async getAllNfts(): Promise<Nft[]> {
    return await db.select().from(nfts);
  }
  
  async getNftById(id: number): Promise<Nft | undefined> {
    const [nft] = await db.select().from(nfts).where(eq(nfts.id, id));
    return nft;
  }
  
  async createNft(insertNft: InsertNft): Promise<Nft> {
    // Ensure rarity is one of the allowed values
    let rarity = insertNft.rarity;
    
    // Validate the rarity if needed
    if (rarity !== 'common' && rarity !== 'rare' && rarity !== 'epic' && rarity !== 'legendary') {
      rarity = 'common'; // Default to common if invalid
    }
    
    const [nft] = await db.insert(nfts).values({
      ...insertNft,
      rarity,
      supply: insertNft.supply ?? 1,
      remainingSupply: insertNft.remainingSupply ?? insertNft.supply ?? 1
    }).returning();
    return nft;
  }
  
  async getUserNfts(userId: number): Promise<UserNft[]> {
    return await db
      .select()
      .from(userNfts)
      .where(eq(userNfts.userId, userId));
  }
  
  async purchaseNft(insertUserNft: InsertUserNft): Promise<UserNft | undefined> {
    // Get the NFT and user
    const [nft] = await db.select().from(nfts).where(eq(nfts.id, insertUserNft.nftId));
    const [user] = await db.select().from(users).where(eq(users.id, insertUserNft.userId));
    
    // Validations
    if (!nft || !user) return undefined;
    if (nft.remainingSupply <= 0) return undefined;
    if (user.xp < nft.price) return undefined;
    
    // Start transaction
    return await db.transaction(async (tx) => {
      // Deduct XP from user
      await tx
        .update(users)
        .set({ xp: user.xp - nft.price })
        .where(eq(users.id, user.id));
      
      // Reduce NFT supply
      await tx
        .update(nfts)
        .set({ remainingSupply: nft.remainingSupply - 1 })
        .where(eq(nfts.id, nft.id));
      
      // Record purchase
      const [userNft] = await tx
        .insert(userNfts)
        .values(insertUserNft)
        .returning();
        
      return userNft;
    });
  }
  
  // XP Activity methods
  async getAllXpActivities(): Promise<XpActivity[]> {
    return await db.select().from(xpActivities);
  }
  
  async getXpActivityById(id: number): Promise<XpActivity | undefined> {
    const [activity] = await db.select().from(xpActivities).where(eq(xpActivities.id, id));
    return activity;
  }
  
  async createXpActivity(insertXpActivity: InsertXpActivity): Promise<XpActivity> {
    const [activity] = await db.insert(xpActivities).values({
      ...insertXpActivity,
      cooldownMinutes: insertXpActivity.cooldownMinutes ?? 0
    }).returning();
    return activity;
  }
  
  async recordUserActivity(insertUserActivity: InsertUserActivity): Promise<UserActivity> {
    // Start transaction to record activity and update XP
    return await db.transaction(async (tx) => {
      // Record the activity
      const [userActivity] = await tx
        .insert(userActivities)
        .values(insertUserActivity)
        .returning();
      
      // Update user's XP
      const [user] = await tx
        .select()
        .from(users)
        .where(eq(users.id, insertUserActivity.userId));
      
      if (user) {
        const updatedXp = user.xp + insertUserActivity.xpEarned;
        const updatedLevel = Math.max(1, Math.floor(updatedXp / 1000) + 1);
        
        await tx
          .update(users)
          .set({
            xp: updatedXp,
            level: updatedLevel
          })
          .where(eq(users.id, user.id));
      }
      
      return userActivity;
    });
  }
  
  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivities)
      .where(eq(userActivities.userId, userId));
  }
  
  async checkActivityEligibility(userId: number, activityId: number): Promise<boolean> {
    // Get the activity
    const [activity] = await db
      .select()
      .from(xpActivities)
      .where(eq(xpActivities.id, activityId));
    
    if (!activity) return false;
    
    // If no cooldown, always eligible
    if (activity.cooldownMinutes === 0) return true;
    
    // Get most recent activity of this type by this user
    const mostRecent = await db
      .select()
      .from(userActivities)
      .where(and(
        eq(userActivities.userId, userId),
        eq(userActivities.activityId, activityId)
      ))
      .orderBy(desc(userActivities.performedAt))
      .limit(1);
    
    // If no previous activity, user is eligible
    if (mostRecent.length === 0) return true;
    
    // Calculate if cooldown period has passed
    const lastActivity = mostRecent[0];
    const cooldownMs = activity.cooldownMinutes * 60 * 1000;
    const now = new Date();
    const timeSinceLastActivity = now.getTime() - lastActivity.performedAt.getTime();
    
    return timeSinceLastActivity >= cooldownMs;
  }
  
  // Newsletter subscriber methods
  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await db.select().from(newsletterSubscribers);
  }
  
  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));
    return subscriber;
  }
  
  async createNewsletterSubscriber(insertSubscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [subscriber] = await db
      .insert(newsletterSubscribers)
      .values({
        ...insertSubscriber,
        isActive: true
      })
      .returning();
    return subscriber;
  }
  
  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    const [subscriber] = await db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email));
    
    if (!subscriber) return false;
    
    await db
      .update(newsletterSubscribers)
      .set({ isActive: false })
      .where(eq(newsletterSubscribers.id, subscriber.id));
    
    return true;
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
    
    // Initialize XP activities if they don't exist
    const existingActivities = await this.getAllXpActivities();
    if (existingActivities.length === 0) {
      const activities = [
        { 
          name: "Daily Login", 
          description: "Log in to the platform daily", 
          xpReward: 10, 
          cooldownMinutes: 1440 // 24 hours
        },
        { 
          name: "Submit Issue", 
          description: "Submit a new community issue", 
          xpReward: 50, 
          cooldownMinutes: 0 // No cooldown
        },
        { 
          name: "Comment", 
          description: "Comment on an issue", 
          xpReward: 5, 
          cooldownMinutes: 5 // 5 minutes
        },
        { 
          name: "Vote", 
          description: "Vote on an issue", 
          xpReward: 2, 
          cooldownMinutes: 1 // 1 minute
        },
        { 
          name: "Add Tag", 
          description: "Add a tag to an issue", 
          xpReward: 5, 
          cooldownMinutes: 10 // 10 minutes
        },
        { 
          name: "Game Win", 
          description: "Win a mini-game", 
          xpReward: 25, 
          cooldownMinutes: 60 // 1 hour
        },
        { 
          name: "Game Play", 
          description: "Play a mini-game", 
          xpReward: 5, 
          cooldownMinutes: 15 // 15 minutes
        },
        { 
          name: "Send Chat Message", 
          description: "Participate in community chat", 
          xpReward: 1, 
          cooldownMinutes: 1 // 1 minute
        }
      ];
      
      for (const activity of activities) {
        await this.createXpActivity(activity);
      }
    }
    
    // Initialize NFTs if they don't exist
    const existingNfts = await this.getAllNfts();
    if (existingNfts.length === 0) {
      // Ensure we create NFTs with proper rarity values
      const nfts: Array<{
        name: string;
        description: string;
        imageUrl: string;
        price: number;
        rarity: "common" | "rare" | "epic" | "legendary";
        supply: number;
        remainingSupply: number;
      }> = [
        {
          name: "Cosmic Explorer Badge",
          description: "A basic badge for new community members",
          imageUrl: "/badges/cosmic-explorer.svg",
          price: 100,
          rarity: "common",
          supply: 1000,
          remainingSupply: 1000
        },
        {
          name: "Issue Hunter",
          description: "Badge for active issue reporters",
          imageUrl: "/badges/issue-hunter.svg",
          price: 500,
          rarity: "common",
          supply: 500,
          remainingSupply: 500
        },
        {
          name: "Community Champion",
          description: "Badge for exceptional community contributors",
          imageUrl: "/badges/community-champion.svg",
          price: 1000,
          rarity: "rare",
          supply: 100,
          remainingSupply: 100
        },
        {
          name: "Game Master",
          description: "Badge for winning all mini-games",
          imageUrl: "/badges/game-master.svg",
          price: 2000,
          rarity: "epic",
          supply: 50,
          remainingSupply: 50
        },
        {
          name: "Cosmic Legend",
          description: "The highest honor in the community",
          imageUrl: "/badges/cosmic-legend.svg",
          price: 5000,
          rarity: "legendary",
          supply: 10,
          remainingSupply: 10
        }
      ];
      
      for (const nft of nfts) {
        await this.createNft(nft as InsertNft);
      }
    }
  }
}

export const storage = new DatabaseStorage();
