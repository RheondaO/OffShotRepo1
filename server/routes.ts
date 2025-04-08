import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertIssueSchema, 
  insertVoteSchema,
  insertUserSchema,
  insertCategorySchema
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

  const httpServer = createServer(app);
  return httpServer;
}
