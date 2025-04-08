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
  insertIssueTagSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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
      
      if (hasVoted) {
        // Remove vote if already voted
        await storage.removeVote(voteData.issueId, voteData.userId);
        return res.json({ voted: false });
      } else {
        // Add vote
        await storage.createVote(voteData);
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
