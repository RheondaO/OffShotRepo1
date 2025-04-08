import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { 
  insertIssueSchema, 
  insertVoteSchema,
  insertUserSchema,
  insertCategorySchema,
  insertTagSchema,
  insertIssueTagSchema,
  insertNftSchema,
  insertUserNftSchema,
  insertXpActivitySchema,
  insertUserActivitySchema,
  insertNewsletterSubscriberSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { calculateIssuePriority } from "./utils";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser(userData);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (_req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      return res.json(categories);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.json(category);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      return res.status(201).json(category);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Issues routes
  app.get("/api/issues", async (req: Request, res: Response) => {
    try {
      const { categoryId, search } = req.query;
      
      if (categoryId) {
        const issues = await storage.getIssuesByCategory(Number(categoryId));
        return res.json(issues);
      }
      
      if (search && typeof search === 'string') {
        const issues = await storage.searchIssues(search);
        return res.json(issues);
      }
      
      const issues = await storage.getAllIssues();
      return res.json(issues);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch issues" });
    }
  });

  app.get("/api/issues/featured", async (_req: Request, res: Response) => {
    try {
      const issues = await storage.getFeaturedIssues();
      return res.json(issues);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch featured issues" });
    }
  });

  app.get("/api/issues/trending", async (_req: Request, res: Response) => {
    try {
      const issues = await storage.getTrendingIssues();
      return res.json(issues);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch trending issues" });
    }
  });

  app.get("/api/issues/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const issue = await storage.getIssueById(id);
      
      if (!issue) {
        return res.status(404).json({ message: "Issue not found" });
      }
      
      return res.json(issue);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch issue" });
    }
  });

  app.post("/api/issues", async (req: Request, res: Response) => {
    try {
      // The schema already has default 'low' for priority
      const issueData = insertIssueSchema.parse(req.body);
      const issue = await storage.createIssue(issueData);
      return res.status(201).json(issue);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create issue" });
    }
  });

  // Votes routes
  app.post("/api/votes", async (req: Request, res: Response) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      
      // Check if user has already voted
      const hasVoted = await storage.hasUserVoted(voteData.issueId, voteData.userId);
      let issue;
      
      if (hasVoted) {
        // Remove vote if already voted
        await storage.removeVote(voteData.issueId, voteData.userId);
        
        // Get updated issue to recalculate priority
        issue = await storage.getIssueById(voteData.issueId);
        if (issue) {
          // Update issue priority based on vote count
          const priority = calculateIssuePriority(issue.votes);
          await storage.updateIssue(voteData.issueId, { priority });
        }
        
        return res.json({ voted: false });
      } else {
        // Add vote
        await storage.createVote(voteData);
        
        // Get updated issue to recalculate priority
        issue = await storage.getIssueById(voteData.issueId);
        if (issue) {
          // Update issue priority based on vote count
          const priority = calculateIssuePriority(issue.votes);
          await storage.updateIssue(voteData.issueId, { priority });
        }
        
        return res.status(201).json({ voted: true });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create vote" });
    }
  });
  
  // Tags routes
  app.get("/api/tags", async (req: Request, res: Response) => {
    try {
      const { search } = req.query;
      
      if (search && typeof search === 'string') {
        const tags = await storage.searchTags(search);
        return res.json(tags);
      }
      
      const tags = await storage.getAllTags();
      return res.json(tags);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch tags" });
    }
  });
  
  app.get("/api/tags/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const tag = await storage.getTagById(id);
      
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      return res.json(tag);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch tag" });
    }
  });
  
  app.post("/api/tags", async (req: Request, res: Response) => {
    try {
      const tagData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(tagData);
      return res.status(201).json(tag);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create tag" });
    }
  });
  
  app.get("/api/issues/:issueId/tags", async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const tags = await storage.getTagsByIssue(issueId);
      return res.json(tags);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch tags for issue" });
    }
  });
  
  app.post("/api/issues/:issueId/tags", async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const { tagId, createdBy } = req.body;
      
      if (!tagId || !createdBy) {
        return res.status(400).json({ message: "TagId and createdBy are required" });
      }
      
      const issueTagData = insertIssueTagSchema.parse({
        issueId,
        tagId,
        createdBy
      });
      
      const issueTag = await storage.addTagToIssue(issueTagData);
      return res.status(201).json(issueTag);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to add tag to issue" });
    }
  });
  
  app.delete("/api/issues/:issueId/tags/:tagId", async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const tagId = parseInt(req.params.tagId);
      
      const success = await storage.removeTagFromIssue(issueId, tagId);
      
      if (!success) {
        return res.status(404).json({ message: "Tag is not attached to this issue" });
      }
      
      return res.status(200).json({ message: "Tag removed from issue" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to remove tag from issue" });
    }
  });
  
  app.get("/api/tags/:tagId/issues", async (req: Request, res: Response) => {
    try {
      const tagId = parseInt(req.params.tagId);
      const issues = await storage.getIssuesByTag(tagId);
      return res.json(issues);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch issues by tag" });
    }
  });
  
  // Gamification API routes
  
  // Get user XP and level
  app.get("/api/users/:userId/xp", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      const user = await storage.getUser(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      
      return res.json({ xp: user.xp, level: user.level });
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user XP" });
    }
  });
  
  // NFT endpoints
  
  // Get all NFTs
  app.get("/api/nfts", async (_req: Request, res: Response) => {
    try {
      const nfts = await storage.getAllNfts();
      return res.json(nfts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch NFTs" });
    }
  });
  
  // Get NFT by ID
  app.get("/api/nfts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid NFT ID" });
      
      const nft = await storage.getNftById(id);
      if (!nft) return res.status(404).json({ message: "NFT not found" });
      
      return res.json(nft);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch NFT" });
    }
  });
  
  // Create new NFT
  app.post("/api/nfts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertNftSchema.parse(req.body);
      const nft = await storage.createNft(validatedData);
      return res.status(201).json(nft);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create NFT" });
    }
  });
  
  // Get user's NFTs
  app.get("/api/users/:userId/nfts", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      const userNfts = await storage.getUserNfts(userId);
      return res.json(userNfts);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user NFTs" });
    }
  });
  
  // Get user's issues (issues created by a specific user)
  app.get("/api/users/:userId/issues", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      const issues = await storage.getAllIssues();
      const userIssues = issues.filter(issue => issue.userId === userId);
      return res.json(userIssues);
    } catch (error) {
      console.error("Error getting user issues:", error);
      return res.status(500).json({ message: "Failed to fetch user issues" });
    }
  });
  
  // Get user's votes
  app.get("/api/users/:userId/votes", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      const votes = await storage.getVotesByUser(userId);
      return res.json(votes);
    } catch (error) {
      console.error("Error getting user votes:", error);
      return res.status(500).json({ message: "Failed to fetch user votes" });
    }
  });
  
  // Purchase an NFT
  app.post("/api/users/:userId/nfts", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      const validatedData = insertUserNftSchema.parse({ 
        ...req.body, 
        userId
      });
      
      const userNft = await storage.purchaseNft(validatedData);
      if (!userNft) {
        return res.status(400).json({ 
          message: "Could not purchase NFT. Check XP balance, eligibility, and availability." 
        });
      }
      
      return res.status(201).json(userNft);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to purchase NFT" });
    }
  });
  
  // Activity endpoints
  
  // Get all XP activities
  app.get("/api/activities", async (_req: Request, res: Response) => {
    try {
      const activities = await storage.getAllXpActivities();
      return res.json(activities);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  
  // Get activity by ID
  app.get("/api/activities/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) return res.status(400).json({ message: "Invalid activity ID" });
      
      const activity = await storage.getXpActivityById(id);
      if (!activity) return res.status(404).json({ message: "Activity not found" });
      
      return res.json(activity);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch activity" });
    }
  });
  
  // Create new activity type
  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const validatedData = insertXpActivitySchema.parse(req.body);
      const activity = await storage.createXpActivity(validatedData);
      return res.status(201).json(activity);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to create activity" });
    }
  });
  
  // Record a user activity
  app.post("/api/users/:userId/activities", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      // Add userId to the request body
      const data = { ...req.body, userId };
      
      // Validate the data
      const validatedData = insertUserActivitySchema.parse(data);
      
      // Check eligibility
      const isEligible = await storage.checkActivityEligibility(userId, validatedData.activityId);
      if (!isEligible) {
        return res.status(400).json({ message: "Activity on cooldown or not eligible" });
      }
      
      // Record the activity
      const userActivity = await storage.recordUserActivity(validatedData);
      return res.status(201).json(userActivity);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to record activity" });
    }
  });
  
  // Get user's activities
  app.get("/api/users/:userId/activities", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });
      
      const activities = await storage.getUserActivities(userId);
      return res.json(activities);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch user activities" });
    }
  });
  
  // Check if user is eligible for an activity
  app.get("/api/users/:userId/activities/:activityId/eligible", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const activityId = parseInt(req.params.activityId);
      
      if (isNaN(userId) || isNaN(activityId)) {
        return res.status(400).json({ message: "Invalid user ID or activity ID" });
      }
      
      const isEligible = await storage.checkActivityEligibility(userId, activityId);
      return res.json({ eligible: isEligible });
    } catch (error) {
      return res.status(500).json({ message: "Failed to check eligibility" });
    }
  });
  
  // Newsletter Subscriber endpoints
  
  // Get all newsletter subscribers
  app.get("/api/newsletter/subscribers", async (_req: Request, res: Response) => {
    try {
      const subscribers = await storage.getAllNewsletterSubscribers();
      return res.json(subscribers);
    } catch (error) {
      return res.status(500).json({ message: "Failed to fetch newsletter subscribers" });
    }
  });
  
  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const { email, name, interests } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Default interests if not provided
      const subscriberInterests = interests || ['general'];
      
      // Validate the data
      const subscriberData = insertNewsletterSubscriberSchema.parse({
        email,
        name: name || "Subscriber", // Default name if not provided
        interests: subscriberInterests
      });
      
      // Check if already subscribed
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(email);
      if (existingSubscriber) {
        if (existingSubscriber.isActive) {
          return res.status(409).json({ message: "Email is already subscribed" });
        } else {
          // Reactivate subscription
          await storage.createNewsletterSubscriber(subscriberData);
          return res.status(200).json({ message: "Subscription reactivated" });
        }
      }
      
      // Create new subscription
      const subscriber = await storage.createNewsletterSubscriber(subscriberData);
      return res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      return res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });
  
  // Unsubscribe from newsletter
  app.post("/api/newsletter/unsubscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      const success = await storage.unsubscribeFromNewsletter(email);
      
      if (!success) {
        return res.status(404).json({ message: "Email not found in subscriber list" });
      }
      
      return res.status(200).json({ message: "Successfully unsubscribed" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to unsubscribe from newsletter" });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server on a distinct path
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients with their usernames
  const clients = new Map<WebSocket, { username: string }>();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected to WebSocket');
    
    // Handle messages from clients
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        
        // Handle different message types
        switch (data.type) {
          case 'join':
            // Store user info with the connection
            clients.set(ws, { username: data.username || 'Anonymous' });
            
            // Broadcast join message to all clients
            broadcastMessage({
              type: 'system',
              content: `${data.username || 'Anonymous'} has joined the chat`,
              timestamp: new Date().toISOString(),
              username: 'System'
            });
            break;
            
          case 'message':
            // Get user info
            const userInfo = clients.get(ws);
            
            if (userInfo && data.content) {
              // Broadcast message to all clients
              broadcastMessage({
                type: 'message',
                content: data.content,
                timestamp: new Date().toISOString(),
                username: userInfo.username
              });
            }
            break;
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      const userInfo = clients.get(ws);
      
      if (userInfo) {
        // Broadcast leave message
        broadcastMessage({
          type: 'system',
          content: `${userInfo.username} has left the chat`,
          timestamp: new Date().toISOString(),
          username: 'System'
        });
        
        // Remove client from the map
        clients.delete(ws);
      }
      
      console.log('Client disconnected from WebSocket');
    });
  });
  
  // Function to broadcast messages to all connected clients
  function broadcastMessage(message: any) {
    const messageStr = JSON.stringify(message);
    
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(messageStr);
      }
    });
  }
  
  return httpServer;
}
