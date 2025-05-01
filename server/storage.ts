import { 
  users, type User, type InsertUser,
  events, type Event, type InsertEvent,
  tasks, type Task, type InsertTask,
  notifications, type Notification, type InsertNotification,
  quickActionsLog, type QuickActionLog, type InsertQuickActionLog,
  financialTransactions, type FinancialTransaction, type InsertFinancialTransaction,
  budgets, type Budget, type InsertBudget,
  financialAccounts, type FinancialAccount, type InsertFinancialAccount,
  healthMetrics, type HealthMetric, type InsertHealthMetric,
  educationalContent, type EducationalContent, type InsertEducationalContent,
  educationalProgress, type EducationalProgress, type InsertEducationalProgress,
  userTips, type UserTip, type InsertUserTip
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByFirebaseId(firebaseId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User>;

  // Calendar event operations
  getEventsByMonth(userId: number, month: string): Promise<Record<string, Event[]>>;
  getEventsByDate(userId: number, date: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, eventData: Partial<Event>): Promise<Event>;
  deleteEvent(id: number): Promise<void>;

  // Task operations
  getTasks(userId: number): Promise<Task[]>;
  getTasksByDate(userId: number, date: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, taskData: Partial<Task>): Promise<Task>;
  deleteTask(id: number): Promise<void>;

  // Notification operations
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification>;
  markAllNotificationsAsRead(userId: number): Promise<void>;
  deleteNotification(id: number): Promise<void>;

  // Quick actions logging
  logQuickAction(log: InsertQuickActionLog): Promise<QuickActionLog>;
  getQuickActionLogs(userId: number): Promise<QuickActionLog[]>;
  
  // Financial transaction operations
  getFinancialTransactions(userId: number): Promise<FinancialTransaction[]>;
  getFinancialTransactionsByCategory(userId: number, category: string): Promise<FinancialTransaction[]>;
  getFinancialTransactionsByDateRange(userId: number, startDate: string, endDate: string): Promise<FinancialTransaction[]>;
  createFinancialTransaction(transaction: InsertFinancialTransaction): Promise<FinancialTransaction>;
  updateFinancialTransaction(id: number, transactionData: Partial<FinancialTransaction>): Promise<FinancialTransaction>;
  deleteFinancialTransaction(id: number): Promise<void>;
  
  // Budget operations
  getBudgets(userId: number): Promise<Budget[]>;
  getBudgetsByCategory(userId: number, category: string): Promise<Budget[]>;
  createBudget(budget: InsertBudget): Promise<Budget>;
  updateBudget(id: number, budgetData: Partial<Budget>): Promise<Budget>;
  deleteBudget(id: number): Promise<void>;
  
  // Financial account operations
  getFinancialAccounts(userId: number): Promise<FinancialAccount[]>;
  getFinancialAccountById(id: number): Promise<FinancialAccount | undefined>;
  createFinancialAccount(account: InsertFinancialAccount): Promise<FinancialAccount>;
  updateFinancialAccount(id: number, accountData: Partial<FinancialAccount>): Promise<FinancialAccount>;
  deleteFinancialAccount(id: number): Promise<void>;
  
  // Health metric operations
  getHealthMetrics(userId: number): Promise<HealthMetric[]>;
  getHealthMetricsByType(userId: number, metricType: string): Promise<HealthMetric[]>;
  getHealthMetricsByDateRange(userId: number, startDate: string, endDate: string): Promise<HealthMetric[]>;
  createHealthMetric(metric: InsertHealthMetric): Promise<HealthMetric>;
  updateHealthMetric(id: number, metricData: Partial<HealthMetric>): Promise<HealthMetric>;
  deleteHealthMetric(id: number): Promise<void>;
  
  // Educational content operations
  getEducationalContent(): Promise<EducationalContent[]>;
  getEducationalContentByCategory(category: string): Promise<EducationalContent[]>;
  getEducationalContentById(id: number): Promise<EducationalContent | undefined>;
  createEducationalContent(content: InsertEducationalContent): Promise<EducationalContent>;
  updateEducationalContent(id: number, contentData: Partial<EducationalContent>): Promise<EducationalContent>;
  deleteEducationalContent(id: number): Promise<void>;
  
  // Educational progress operations
  getEducationalProgress(userId: number): Promise<EducationalProgress[]>;
  getEducationalProgressByContent(userId: number, contentId: number): Promise<EducationalProgress | undefined>;
  createEducationalProgress(progress: InsertEducationalProgress): Promise<EducationalProgress>;
  updateEducationalProgress(id: number, progressData: Partial<EducationalProgress>): Promise<EducationalProgress>;
  deleteEducationalProgress(id: number): Promise<void>;
  
  // User tips operations
  getUserTips(): Promise<UserTip[]>;
  getUserTipsByCategory(category: string): Promise<UserTip[]>;
  createUserTip(tip: InsertUserTip): Promise<UserTip>;
  updateUserTip(id: number, tipData: Partial<UserTip>): Promise<UserTip>;
  deleteUserTip(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private tasks: Map<number, Task>;
  private notifications: Map<number, Notification>;
  private quickActionsLogs: Map<number, QuickActionLog>;
  private financialTransactions: Map<number, FinancialTransaction>;
  private budgets: Map<number, Budget>;
  private financialAccounts: Map<number, FinancialAccount>;
  private healthMetrics: Map<number, HealthMetric>;
  private educationalContents: Map<number, EducationalContent>;
  private educationalProgresses: Map<number, EducationalProgress>;
  private userTips: Map<number, UserTip>;
  
  private userIdCounter: number;
  private eventIdCounter: number;
  private taskIdCounter: number;
  private notificationIdCounter: number;
  private quickActionLogIdCounter: number;
  private financialTransactionIdCounter: number;
  private budgetIdCounter: number;
  private financialAccountIdCounter: number;
  private healthMetricIdCounter: number;
  private educationalContentIdCounter: number;
  private educationalProgressIdCounter: number;
  private userTipIdCounter: number;

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.tasks = new Map();
    this.notifications = new Map();
    this.quickActionsLogs = new Map();
    this.financialTransactions = new Map();
    this.budgets = new Map();
    this.financialAccounts = new Map();
    this.healthMetrics = new Map();
    this.educationalContents = new Map();
    this.educationalProgresses = new Map();
    this.userTips = new Map();
    
    this.userIdCounter = 1;
    this.eventIdCounter = 1;
    this.taskIdCounter = 1;
    this.notificationIdCounter = 1;
    this.quickActionLogIdCounter = 1;
    this.financialTransactionIdCounter = 1;
    this.budgetIdCounter = 1;
    this.financialAccountIdCounter = 1;
    this.healthMetricIdCounter = 1;
    this.educationalContentIdCounter = 1;
    this.educationalProgressIdCounter = 1;
    this.userTipIdCounter = 1;

    // Add some initial notifications for demonstration
    this.initializeData();
  }

  private initializeData() {
    // Create a demo user to match Firebase mock mode
    const demoUser: InsertUser = {
      username: 'demo',
      password: 'password',
      email: 'demo@example.com',
      displayName: 'Demo User',
      photoURL: null,
      firebaseId: 'demo-user-id',
      settings: null
    };
    
    this.createUser(demoUser).then(user => {
      // Add some initial demo data for the user
      // Add a notification
      this.createNotification({
        userId: user.id,
        title: "Welcome",
        message: "Welcome to your personal assistant!",
        type: "info",
        time: new Date().toISOString(),
        read: false,
        actionUrl: null
      });
      
      // Create a calendar event
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      this.createEvent({
        userId: user.id,
        title: "Demo Event",
        date: todayStr,
        category: "personal",
        description: "This is a demo event",
        startTime: "14:00",
        endTime: "15:00",
        completed: false
      });
      
      // Create a task
      this.createTask({
        userId: user.id,
        title: "Complete profile",
        date: todayStr,
        category: "Tasks",
        time: "12:00",
        description: "Update your profile with personal information",
        completed: false
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByFirebaseId(firebaseId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseId === firebaseId
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser,
      id,
      createdAt: now,
      // Set default values for nullable fields if they're not provided
      firebaseId: insertUser.firebaseId || null,
      displayName: insertUser.displayName || null,
      photoURL: insertUser.photoURL || null,
      settings: insertUser.settings || {}
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Calendar event operations
  async getEventsByMonth(userId: number, month: string): Promise<Record<string, Event[]>> {
    const allEvents = Array.from(this.events.values()).filter(
      (event) => event.userId === userId && event.date.startsWith(month)
    );

    // Group events by date
    const groupedEvents: Record<string, Event[]> = {};
    allEvents.forEach(event => {
      if (!groupedEvents[event.date]) {
        groupedEvents[event.date] = [];
      }
      groupedEvents[event.date].push(event);
    });

    return groupedEvents;
  }

  async getEventsByDate(userId: number, date: string): Promise<Event[]> {
    return Array.from(this.events.values()).filter(
      (event) => event.userId === userId && event.date === date
    );
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.eventIdCounter++;
    const now = new Date();
    const event: Event = {
      ...insertEvent,
      id,
      createdAt: now,
      // Set default values for nullable fields
      description: insertEvent.description || null,
      startTime: insertEvent.startTime || null,
      endTime: insertEvent.endTime || null,
      completed: insertEvent.completed || false
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventData: Partial<Event>): Promise<Event> {
    const event = this.events.get(id);
    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }

    const updatedEvent = { ...event, ...eventData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<void> {
    if (!this.events.has(id)) {
      throw new Error(`Event with id ${id} not found`);
    }
    this.events.delete(id);
  }

  // Task operations
  async getTasks(userId: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId
    );
  }

  async getTasksByDate(userId: number, date: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId && task.date === date
    );
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id,
      createdAt: now,
      // Set default values for nullable fields
      description: insertTask.description || null,
      time: insertTask.time || null,
      completed: insertTask.completed || false
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: number, taskData: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    const updatedTask = { ...task, ...taskData };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.tasks.has(id)) {
      throw new Error(`Task with id ${id} not found`);
    }
    this.tasks.delete(id);
  }

  // Notification operations
  async getNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: now,
      // Set default values for nullable fields
      read: insertNotification.read || false,
      actionUrl: insertNotification.actionUrl || null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async updateNotification(id: number, notificationData: Partial<Notification>): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    const updatedNotification = { ...notification, ...notificationData };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async markAllNotificationsAsRead(userId: number): Promise<void> {
    const userNotifications = Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId);
    
    userNotifications.forEach(notification => {
      this.notifications.set(notification.id, { ...notification, read: true });
    });
  }

  async deleteNotification(id: number): Promise<void> {
    if (!this.notifications.has(id)) {
      throw new Error(`Notification with id ${id} not found`);
    }
    this.notifications.delete(id);
  }

  // Quick actions logging
  async logQuickAction(insertLog: InsertQuickActionLog): Promise<QuickActionLog> {
    const id = this.quickActionLogIdCounter++;
    const quickActionLog: QuickActionLog = {
      ...insertLog,
      id
    };
    this.quickActionsLogs.set(id, quickActionLog);
    return quickActionLog;
  }

  async getQuickActionLogs(userId: number): Promise<QuickActionLog[]> {
    return Array.from(this.quickActionsLogs.values())
      .filter((log) => log.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  // Financial Transaction operations
  async getFinancialTransactions(userId: number): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getFinancialTransactionsByCategory(userId: number, category: string): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values())
      .filter((transaction) => transaction.userId === userId && transaction.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getFinancialTransactionsByDateRange(userId: number, startDate: string, endDate: string): Promise<FinancialTransaction[]> {
    return Array.from(this.financialTransactions.values())
      .filter((transaction) => {
        return transaction.userId === userId && 
               transaction.date >= startDate && 
               transaction.date <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createFinancialTransaction(insertTransaction: InsertFinancialTransaction): Promise<FinancialTransaction> {
    const id = this.financialTransactionIdCounter++;
    const now = new Date();
    const transaction: FinancialTransaction = {
      ...insertTransaction,
      id,
      createdAt: now
    };
    this.financialTransactions.set(id, transaction);
    return transaction;
  }
  
  async updateFinancialTransaction(id: number, transactionData: Partial<FinancialTransaction>): Promise<FinancialTransaction> {
    const transaction = this.financialTransactions.get(id);
    if (!transaction) {
      throw new Error(`Financial transaction with id ${id} not found`);
    }
    
    const updatedTransaction = { ...transaction, ...transactionData };
    this.financialTransactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
  
  async deleteFinancialTransaction(id: number): Promise<void> {
    if (!this.financialTransactions.has(id)) {
      throw new Error(`Financial transaction with id ${id} not found`);
    }
    this.financialTransactions.delete(id);
  }
  
  // Budget operations
  async getBudgets(userId: number): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter((budget) => budget.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getBudgetsByCategory(userId: number, category: string): Promise<Budget[]> {
    return Array.from(this.budgets.values())
      .filter((budget) => budget.userId === userId && budget.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createBudget(insertBudget: InsertBudget): Promise<Budget> {
    const id = this.budgetIdCounter++;
    const now = new Date();
    const budget: Budget = {
      ...insertBudget,
      id,
      createdAt: now
    };
    this.budgets.set(id, budget);
    return budget;
  }
  
  async updateBudget(id: number, budgetData: Partial<Budget>): Promise<Budget> {
    const budget = this.budgets.get(id);
    if (!budget) {
      throw new Error(`Budget with id ${id} not found`);
    }
    
    const updatedBudget = { ...budget, ...budgetData };
    this.budgets.set(id, updatedBudget);
    return updatedBudget;
  }
  
  async deleteBudget(id: number): Promise<void> {
    if (!this.budgets.has(id)) {
      throw new Error(`Budget with id ${id} not found`);
    }
    this.budgets.delete(id);
  }
  
  // Financial Account operations
  async getFinancialAccounts(userId: number): Promise<FinancialAccount[]> {
    return Array.from(this.financialAccounts.values())
      .filter((account) => account.userId === userId)
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  
  async getFinancialAccountById(id: number): Promise<FinancialAccount | undefined> {
    return this.financialAccounts.get(id);
  }
  
  async createFinancialAccount(insertAccount: InsertFinancialAccount): Promise<FinancialAccount> {
    const id = this.financialAccountIdCounter++;
    const now = new Date();
    const account: FinancialAccount = {
      ...insertAccount,
      id,
      createdAt: now
    };
    this.financialAccounts.set(id, account);
    return account;
  }
  
  async updateFinancialAccount(id: number, accountData: Partial<FinancialAccount>): Promise<FinancialAccount> {
    const account = this.financialAccounts.get(id);
    if (!account) {
      throw new Error(`Financial account with id ${id} not found`);
    }
    
    const updatedAccount = { ...account, ...accountData };
    this.financialAccounts.set(id, updatedAccount);
    return updatedAccount;
  }
  
  async deleteFinancialAccount(id: number): Promise<void> {
    if (!this.financialAccounts.has(id)) {
      throw new Error(`Financial account with id ${id} not found`);
    }
    this.financialAccounts.delete(id);
  }
  
  // Health Metric operations
  async getHealthMetrics(userId: number): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values())
      .filter((metric) => metric.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getHealthMetricsByType(userId: number, metricType: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values())
      .filter((metric) => metric.userId === userId && metric.metricType === metricType)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getHealthMetricsByDateRange(userId: number, startDate: string, endDate: string): Promise<HealthMetric[]> {
    return Array.from(this.healthMetrics.values())
      .filter((metric) => {
        return metric.userId === userId && 
               metric.date >= startDate && 
               metric.date <= endDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createHealthMetric(insertMetric: InsertHealthMetric): Promise<HealthMetric> {
    const id = this.healthMetricIdCounter++;
    const now = new Date();
    const metric: HealthMetric = {
      ...insertMetric,
      id,
      createdAt: now
    };
    this.healthMetrics.set(id, metric);
    return metric;
  }
  
  async updateHealthMetric(id: number, metricData: Partial<HealthMetric>): Promise<HealthMetric> {
    const metric = this.healthMetrics.get(id);
    if (!metric) {
      throw new Error(`Health metric with id ${id} not found`);
    }
    
    const updatedMetric = { ...metric, ...metricData };
    this.healthMetrics.set(id, updatedMetric);
    return updatedMetric;
  }
  
  async deleteHealthMetric(id: number): Promise<void> {
    if (!this.healthMetrics.has(id)) {
      throw new Error(`Health metric with id ${id} not found`);
    }
    this.healthMetrics.delete(id);
  }
  
  // Educational Content operations
  async getEducationalContent(): Promise<EducationalContent[]> {
    return Array.from(this.educationalContents.values())
      .sort((a, b) => a.title.localeCompare(b.title));
  }
  
  async getEducationalContentByCategory(category: string): Promise<EducationalContent[]> {
    return Array.from(this.educationalContents.values())
      .filter((content) => content.category === category)
      .sort((a, b) => a.title.localeCompare(b.title));
  }
  
  async getEducationalContentById(id: number): Promise<EducationalContent | undefined> {
    return this.educationalContents.get(id);
  }
  
  async createEducationalContent(insertContent: InsertEducationalContent): Promise<EducationalContent> {
    const id = this.educationalContentIdCounter++;
    const now = new Date();
    const content: EducationalContent = {
      ...insertContent,
      id,
      createdAt: now
    };
    this.educationalContents.set(id, content);
    return content;
  }
  
  async updateEducationalContent(id: number, contentData: Partial<EducationalContent>): Promise<EducationalContent> {
    const content = this.educationalContents.get(id);
    if (!content) {
      throw new Error(`Educational content with id ${id} not found`);
    }
    
    const updatedContent = { ...content, ...contentData };
    this.educationalContents.set(id, updatedContent);
    return updatedContent;
  }
  
  async deleteEducationalContent(id: number): Promise<void> {
    if (!this.educationalContents.has(id)) {
      throw new Error(`Educational content with id ${id} not found`);
    }
    this.educationalContents.delete(id);
  }
  
  // Educational Progress operations
  async getEducationalProgress(userId: number): Promise<EducationalProgress[]> {
    return Array.from(this.educationalProgresses.values())
      .filter((progress) => progress.userId === userId)
      .sort((a, b) => new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime());
  }
  
  async getEducationalProgressByContent(userId: number, contentId: number): Promise<EducationalProgress | undefined> {
    return Array.from(this.educationalProgresses.values())
      .find((progress) => progress.userId === userId && progress.contentId === contentId);
  }
  
  async createEducationalProgress(insertProgress: InsertEducationalProgress): Promise<EducationalProgress> {
    const id = this.educationalProgressIdCounter++;
    const now = new Date();
    const progress: EducationalProgress = {
      ...insertProgress,
      id,
      createdAt: now
    };
    this.educationalProgresses.set(id, progress);
    return progress;
  }
  
  async updateEducationalProgress(id: number, progressData: Partial<EducationalProgress>): Promise<EducationalProgress> {
    const progress = this.educationalProgresses.get(id);
    if (!progress) {
      throw new Error(`Educational progress with id ${id} not found`);
    }
    
    const updatedProgress = { ...progress, ...progressData };
    this.educationalProgresses.set(id, updatedProgress);
    return updatedProgress;
  }
  
  async deleteEducationalProgress(id: number): Promise<void> {
    if (!this.educationalProgresses.has(id)) {
      throw new Error(`Educational progress with id ${id} not found`);
    }
    this.educationalProgresses.delete(id);
  }
  
  // User Tips operations
  async getUserTips(): Promise<UserTip[]> {
    return Array.from(this.userTips.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getUserTipsByCategory(category: string): Promise<UserTip[]> {
    return Array.from(this.userTips.values())
      .filter((tip) => tip.category === category)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createUserTip(insertTip: InsertUserTip): Promise<UserTip> {
    const id = this.userTipIdCounter++;
    const now = new Date();
    const tip: UserTip = {
      ...insertTip,
      id,
      createdAt: now
    };
    this.userTips.set(id, tip);
    return tip;
  }
  
  async updateUserTip(id: number, tipData: Partial<UserTip>): Promise<UserTip> {
    const tip = this.userTips.get(id);
    if (!tip) {
      throw new Error(`User tip with id ${id} not found`);
    }
    
    const updatedTip = { ...tip, ...tipData };
    this.userTips.set(id, updatedTip);
    return updatedTip;
  }
  
  async deleteUserTip(id: number): Promise<void> {
    if (!this.userTips.has(id)) {
      throw new Error(`User tip with id ${id} not found`);
    }
    this.userTips.delete(id);
  }
}

export const storage = new MemStorage();
