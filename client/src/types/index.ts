// User related types
export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  dataSync: boolean;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  settings: UserSettings;
}

// Calendar related types
export type EventCategory = 'work' | 'personal' | 'health' | 'education' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  category: EventCategory;
  completed: boolean;
}

// Task related types
export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  completed: boolean;
  category: string;
}

// Notification related types
export type NotificationType = 'coding_tip' | 'finance' | 'quote' | 'reminder' | 'system';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  read: boolean;
  actionUrl?: string;
}

// Hub related types
export interface Hub {
  id: string;
  name: string;
  description: string;
  articles: number;
  gradient: string;
  imageSrc?: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: number;
  imageUrl?: string;
}

// Learning related types
export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  category: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content: string;
  completed: boolean;
  duration: number;
}
