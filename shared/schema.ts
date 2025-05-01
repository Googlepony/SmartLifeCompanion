import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  firebaseId: text("firebase_id").unique(),
  settings: jsonb("settings"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Calendar events table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  category: text("category").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date").notNull(),
  time: text("time"),
  category: text("category").notNull(),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  time: text("time").notNull(),
  read: boolean("read").default(false).notNull(),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quick actions log table
export const quickActionsLog = pgTable("quick_actions_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  actionId: text("action_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Financial transactions table
export const financialTransactions = pgTable("financial_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  amount: numeric("amount").notNull(),
  date: text("date").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  isIncome: boolean("is_income").default(false).notNull(),
  paymentMethod: text("payment_method"),
  tags: text("tags").array(),
  location: text("location"),
  receiptUrl: text("receipt_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Budgets table
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  amount: numeric("amount").notNull(),
  period: text("period").notNull(), // monthly, weekly, yearly
  category: text("category").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Financial accounts table
export const financialAccounts = pgTable("financial_accounts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // checking, savings, credit, investment
  balance: numeric("balance").notNull(),
  accountNumber: text("account_number"),
  institution: text("institution"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Health metrics table
export const healthMetrics = pgTable("health_metrics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  date: text("date").notNull(),
  metricType: text("metric_type").notNull(), // steps, weight, sleep, water, exercise, etc.
  value: real("value").notNull(),
  unit: text("unit").notNull(), // steps, kg, hours, ml, minutes
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Educational content table
export const educationalContent = pgTable("educational_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(), // taxes, insurance, government, travel, finance, health, communication, negotiation
  subcategory: text("subcategory"),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  imageUrl: text("image_url"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Educational progress table
export const educationalProgress = pgTable("educational_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  contentId: integer("content_id").references(() => educationalContent.id).notNull(),
  completed: boolean("completed").default(false).notNull(),
  progress: real("progress").default(0).notNull(), // percentage 0-100
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User tips table
export const userTips = pgTable("user_tips", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(), // financial, health, communication, negotiation
  content: text("content").notNull(),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  photoURL: true,
  firebaseId: true,
  settings: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  userId: true,
  title: true,
  description: true,
  date: true,
  startTime: true,
  endTime: true,
  category: true,
  completed: true,
});

export const insertTaskSchema = createInsertSchema(tasks).pick({
  userId: true,
  title: true,
  description: true,
  date: true,
  time: true,
  category: true,
  completed: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  time: true,
  read: true,
  actionUrl: true,
});

export const insertQuickActionLogSchema = createInsertSchema(quickActionsLog).pick({
  userId: true,
  actionId: true,
  timestamp: true,
});

export const insertFinancialTransactionSchema = createInsertSchema(financialTransactions).pick({
  userId: true,
  amount: true,
  date: true,
  category: true,
  description: true,
  isIncome: true,
  paymentMethod: true,
  tags: true,
  location: true,
  receiptUrl: true,
});

export const insertBudgetSchema = createInsertSchema(budgets).pick({
  userId: true,
  name: true,
  amount: true,
  period: true,
  category: true,
  startDate: true,
  endDate: true,
  isActive: true,
});

export const insertFinancialAccountSchema = createInsertSchema(financialAccounts).pick({
  userId: true,
  name: true,
  type: true,
  balance: true,
  accountNumber: true,
  institution: true,
  isActive: true,
});

export const insertHealthMetricSchema = createInsertSchema(healthMetrics).pick({
  userId: true,
  date: true,
  metricType: true,
  value: true,
  unit: true,
  notes: true,
});

export const insertEducationalContentSchema = createInsertSchema(educationalContent).pick({
  title: true,
  content: true,
  category: true,
  subcategory: true,
  difficulty: true,
  imageUrl: true,
  tags: true,
});

export const insertEducationalProgressSchema = createInsertSchema(educationalProgress).pick({
  userId: true,
  contentId: true,
  completed: true,
  progress: true,
  lastAccessedAt: true,
});

export const insertUserTipSchema = createInsertSchema(userTips).pick({
  category: true,
  content: true,
  tags: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertQuickActionLog = z.infer<typeof insertQuickActionLogSchema>;
export type QuickActionLog = typeof quickActionsLog.$inferSelect;

export type InsertFinancialTransaction = z.infer<typeof insertFinancialTransactionSchema>;
export type FinancialTransaction = typeof financialTransactions.$inferSelect;

export type InsertBudget = z.infer<typeof insertBudgetSchema>;
export type Budget = typeof budgets.$inferSelect;

export type InsertFinancialAccount = z.infer<typeof insertFinancialAccountSchema>;
export type FinancialAccount = typeof financialAccounts.$inferSelect;

export type InsertHealthMetric = z.infer<typeof insertHealthMetricSchema>;
export type HealthMetric = typeof healthMetrics.$inferSelect;

export type InsertEducationalContent = z.infer<typeof insertEducationalContentSchema>;
export type EducationalContent = typeof educationalContent.$inferSelect;

export type InsertEducationalProgress = z.infer<typeof insertEducationalProgressSchema>;
export type EducationalProgress = typeof educationalProgress.$inferSelect;

export type InsertUserTip = z.infer<typeof insertUserTipSchema>;
export type UserTip = typeof userTips.$inferSelect;
