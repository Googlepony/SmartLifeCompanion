import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { OpenAI } from "openai";
import { z } from "zod";
import { 
  insertTaskSchema, 
  insertNotificationSchema, 
  insertQuickActionLogSchema,
  insertFinancialTransactionSchema,
  insertBudgetSchema,
  insertFinancialAccountSchema,
  insertHealthMetricSchema,
  insertEducationalContentSchema,
  insertEducationalProgressSchema,
  insertUserTipSchema
} from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "sk-placeholder",
});

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/user/firebase/:firebaseId", async (req, res) => {
    try {
      const user = await storage.getUserByFirebaseId(req.params.firebaseId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const user = await storage.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Calendar events routes
  app.get("/api/calendar/:userId/:month", async (req, res) => {
    try {
      // Check if userId is a Firebase ID (string) or a regular user ID (number)
      let user;
      if (isNaN(parseInt(req.params.userId))) {
        // It's a Firebase ID
        user = await storage.getUserByFirebaseId(req.params.userId);
      } else {
        // It's a regular user ID
        user = await storage.getUser(parseInt(req.params.userId));
      }
      
      if (!user) {
        return res.json({}); // Return empty object if user not found
      }
      
      const events = await storage.getEventsByMonth(user.id, req.params.month);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events by month:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/calendar/day/:userId/:date", async (req, res) => {
    try {
      // Check if userId is a Firebase ID (string) or a regular user ID (number)
      let user;
      if (isNaN(parseInt(req.params.userId))) {
        // It's a Firebase ID
        user = await storage.getUserByFirebaseId(req.params.userId);
      } else {
        // It's a regular user ID
        user = await storage.getUser(parseInt(req.params.userId));
      }
      
      if (!user) {
        return res.json([]); // Return empty array if user not found
      }
      
      const events = await storage.getEventsByDate(user.id, req.params.date);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/calendar/task", async (req, res) => {
    try {
      const taskData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(taskData);
      res.status(201).json(task);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid task data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/calendar/task/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      const taskData = req.body;
      const task = await storage.updateTask(taskId, taskData);
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/calendar/task/:id", async (req, res) => {
    try {
      const taskId = parseInt(req.params.id);
      await storage.deleteTask(taskId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotifications(parseInt(req.params.userId));
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/notifications/:id", async (req, res) => {
    try {
      const notificationId = parseInt(req.params.id);
      const notificationData = req.body;
      const notification = await storage.updateNotification(notificationId, notificationData);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/notifications/read-all", async (req, res) => {
    try {
      const { userId } = req.body;
      await storage.markAllNotificationsAsRead(parseInt(userId));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Quick actions log routes
  app.post("/api/quick-actions/log", async (req, res) => {
    try {
      const logData = insertQuickActionLogSchema.parse(req.body);
      const log = await storage.logQuickAction(logData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid log data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  // AI routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      });

      res.json({ message: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ message: "AI service error" });
    }
  });

  app.post("/api/ai/tip", async (req, res) => {
    try {
      const { category } = req.body;
      if (!category) {
        return res.status(400).json({ message: "Category is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `You are a helpful assistant providing tips about ${category}. Keep your response concise (max 100 characters).` 
          },
          { 
            role: "user", 
            content: `Give me a helpful tip about ${category}.` 
          }
        ],
      });

      res.json({ tip: response.choices[0].message.content });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ message: "AI service error" });
    }
  });

  app.post("/api/ai/insights", async (req, res) => {
    try {
      const { userData } = req.body;

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a personal AI assistant providing insights based on user data. Provide a concise suggestion based on their schedule and a few action options." 
          },
          { 
            role: "user", 
            content: `Based on this user data, provide a personalized insight and 3 action options: ${JSON.stringify(userData)}` 
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the JSON response
      const content = JSON.parse(response.choices[0].message.content || "{}");
      
      res.json({
        message: content.insight || "Based on your schedule, I have some recommendations for you.",
        options: content.options || ["Research help", "Coding tips", "Reschedule"]
      });
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ 
        message: "Looking at your schedule, I can help you prioritize tasks.",
        options: ["Research help", "Coding tips", "Reschedule"] 
      });
    }
  });

  // Financial Transaction routes
  app.get("/api/finance/transactions/:userId", async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactions(parseInt(req.params.userId));
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/finance/transactions/:userId/category/:category", async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactionsByCategory(
        parseInt(req.params.userId),
        req.params.category
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/finance/transactions/:userId/date-range/:startDate/:endDate", async (req, res) => {
    try {
      const transactions = await storage.getFinancialTransactionsByDateRange(
        parseInt(req.params.userId),
        req.params.startDate,
        req.params.endDate
      );
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/finance/transactions", async (req, res) => {
    try {
      const transactionData = insertFinancialTransactionSchema.parse(req.body);
      const transaction = await storage.createFinancialTransaction(transactionData);
      res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/finance/transactions/:id", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      const transaction = await storage.updateFinancialTransaction(transactionId, req.body);
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/finance/transactions/:id", async (req, res) => {
    try {
      const transactionId = parseInt(req.params.id);
      await storage.deleteFinancialTransaction(transactionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Budget routes
  app.get("/api/finance/budgets/:userId", async (req, res) => {
    try {
      const budgets = await storage.getBudgets(parseInt(req.params.userId));
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/finance/budgets/:userId/category/:category", async (req, res) => {
    try {
      const budgets = await storage.getBudgetsByCategory(
        parseInt(req.params.userId),
        req.params.category
      );
      res.json(budgets);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/finance/budgets", async (req, res) => {
    try {
      const budgetData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createBudget(budgetData);
      res.status(201).json(budget);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid budget data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/finance/budgets/:id", async (req, res) => {
    try {
      const budgetId = parseInt(req.params.id);
      const budget = await storage.updateBudget(budgetId, req.body);
      res.json(budget);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/finance/budgets/:id", async (req, res) => {
    try {
      const budgetId = parseInt(req.params.id);
      await storage.deleteBudget(budgetId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Financial Account routes
  app.get("/api/finance/accounts/:userId", async (req, res) => {
    try {
      const accounts = await storage.getFinancialAccounts(parseInt(req.params.userId));
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/finance/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getFinancialAccountById(parseInt(req.params.id));
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/finance/accounts", async (req, res) => {
    try {
      const accountData = insertFinancialAccountSchema.parse(req.body);
      const account = await storage.createFinancialAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid account data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/finance/accounts/:id", async (req, res) => {
    try {
      const accountId = parseInt(req.params.id);
      const account = await storage.updateFinancialAccount(accountId, req.body);
      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/finance/accounts/:id", async (req, res) => {
    try {
      const accountId = parseInt(req.params.id);
      await storage.deleteFinancialAccount(accountId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Health Metrics routes
  app.get("/api/health/metrics/:userId", async (req, res) => {
    try {
      const metrics = await storage.getHealthMetrics(parseInt(req.params.userId));
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/health/metrics/:userId/type/:metricType", async (req, res) => {
    try {
      const metrics = await storage.getHealthMetricsByType(
        parseInt(req.params.userId),
        req.params.metricType
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/health/metrics/:userId/date-range/:startDate/:endDate", async (req, res) => {
    try {
      const metrics = await storage.getHealthMetricsByDateRange(
        parseInt(req.params.userId),
        req.params.startDate,
        req.params.endDate
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/health/metrics", async (req, res) => {
    try {
      const metricData = insertHealthMetricSchema.parse(req.body);
      const metric = await storage.createHealthMetric(metricData);
      res.status(201).json(metric);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid metric data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/health/metrics/:id", async (req, res) => {
    try {
      const metricId = parseInt(req.params.id);
      const metric = await storage.updateHealthMetric(metricId, req.body);
      res.json(metric);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/health/metrics/:id", async (req, res) => {
    try {
      const metricId = parseInt(req.params.id);
      await storage.deleteHealthMetric(metricId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Educational Content routes
  app.get("/api/education/content", async (req, res) => {
    try {
      const content = await storage.getEducationalContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/education/content/category/:category", async (req, res) => {
    try {
      const content = await storage.getEducationalContentByCategory(req.params.category);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/education/content/:id", async (req, res) => {
    try {
      const content = await storage.getEducationalContentById(parseInt(req.params.id));
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/education/content", async (req, res) => {
    try {
      const contentData = insertEducationalContentSchema.parse(req.body);
      const content = await storage.createEducationalContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/education/content/:id", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const content = await storage.updateEducationalContent(contentId, req.body);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/education/content/:id", async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      await storage.deleteEducationalContent(contentId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Educational Progress routes
  app.get("/api/education/progress/:userId", async (req, res) => {
    try {
      const progress = await storage.getEducationalProgress(parseInt(req.params.userId));
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/education/progress/:userId/content/:contentId", async (req, res) => {
    try {
      const progress = await storage.getEducationalProgressByContent(
        parseInt(req.params.userId),
        parseInt(req.params.contentId)
      );
      if (!progress) {
        return res.status(404).json({ message: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/education/progress", async (req, res) => {
    try {
      const progressData = insertEducationalProgressSchema.parse(req.body);
      const progress = await storage.createEducationalProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/education/progress/:id", async (req, res) => {
    try {
      const progressId = parseInt(req.params.id);
      const progress = await storage.updateEducationalProgress(progressId, req.body);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/education/progress/:id", async (req, res) => {
    try {
      const progressId = parseInt(req.params.id);
      await storage.deleteEducationalProgress(progressId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User Tips routes
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getUserTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/tips/category/:category", async (req, res) => {
    try {
      const tips = await storage.getUserTipsByCategory(req.params.category);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/tips", async (req, res) => {
    try {
      const tipData = insertUserTipSchema.parse(req.body);
      const tip = await storage.createUserTip(tipData);
      res.status(201).json(tip);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tip data", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/tips/:id", async (req, res) => {
    try {
      const tipId = parseInt(req.params.id);
      const tip = await storage.updateUserTip(tipId, req.body);
      res.json(tip);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/tips/:id", async (req, res) => {
    try {
      const tipId = parseInt(req.params.id);
      await storage.deleteUserTip(tipId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // AI Finance Analysis routes
  app.post("/api/ai/finance/analysis", async (req, res) => {
    try {
      const { transactionData } = req.body;
      
      if (!transactionData) {
        return res.status(400).json({ message: "Transaction data is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a financial advisor analyzing transaction data. Provide insights on spending patterns, saving opportunities, and budget recommendations in JSON format." 
          },
          { 
            role: "user", 
            content: `Analyze these financial transactions and provide insights: ${JSON.stringify(transactionData)}` 
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the JSON response
      const content = JSON.parse(response.choices[0].message.content);
      
      res.json(content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ 
        message: "Financial analysis service error",
        insights: {
          summary: "Unable to analyze transactions at this time.",
          categories: [],
          recommendations: ["Try again later with more transaction data."]
        }
      });
    }
  });

  // AI Health Insights routes
  app.post("/api/ai/health/insights", async (req, res) => {
    try {
      const { healthData } = req.body;
      
      if (!healthData) {
        return res.status(400).json({ message: "Health data is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are a health advisor analyzing health metrics. Provide insights on health patterns, improvement opportunities, and recommendations in JSON format." 
          },
          { 
            role: "user", 
            content: `Analyze these health metrics and provide insights: ${JSON.stringify(healthData)}` 
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the JSON response
      const content = JSON.parse(response.choices[0].message.content);
      
      res.json(content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ 
        message: "Health analysis service error",
        insights: {
          summary: "Unable to analyze health data at this time.",
          metrics: [],
          recommendations: ["Try again later with more health data."]
        }
      });
    }
  });

  // AI Educational recommendations routes
  app.post("/api/ai/education/recommendations", async (req, res) => {
    try {
      const { userInterests, progressData } = req.body;
      
      if (!userInterests) {
        return res.status(400).json({ message: "User interests are required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "You are an educational advisor recommending learning content. Provide personalized content recommendations based on user interests and learning progress in JSON format." 
          },
          { 
            role: "user", 
            content: `Create educational recommendations based on these interests: ${JSON.stringify(userInterests)} and progress data: ${JSON.stringify(progressData || {})}` 
          }
        ],
        response_format: { type: "json_object" }
      });

      // Parse the JSON response
      const content = JSON.parse(response.choices[0].message.content);
      
      res.json(content);
    } catch (error) {
      console.error("OpenAI API error:", error);
      res.status(500).json({ 
        message: "Educational recommendations service error",
        recommendations: [
          {
            title: "General Financial Education",
            category: "finance",
            reason: "Important for everyone"
          }
        ]
      });
    }
  });

  return httpServer;
}
