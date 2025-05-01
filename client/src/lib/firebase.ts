import { initializeApp } from "firebase/app";
import { getAuth, signInWithRedirect, GoogleAuthProvider, getRedirectResult, User, signOut } from "firebase/auth";
import { getDatabase, ref, set, get, update, remove } from "firebase/database";

// Check if we have the required Firebase configuration
const hasFirebaseConfig = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_APP_ID;

// If we're missing any required Firebase configuration, use a mock mode
const firebaseConfig = hasFirebaseConfig ? {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} : {
  // These values are only for local development when no Firebase keys are provided
  // This prevents the app from crashing, but Firebase functionality won't work
  apiKey: "demo-api-key-for-local-development-only",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.firebasestorage.app",
  appId: "demo-app-id",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Log a warning if we're in mock mode
if (!hasFirebaseConfig) {
  console.warn(
    "Firebase is running in mock mode because API keys are missing. Authentication and database operations will not work. Please provide Firebase configuration through environment variables."
  );
}

// Auth functions
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithRedirect(auth, provider);
};

export const handleRedirectResult = async (): Promise<User | null> => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Database functions
export const saveUserData = async (userId: string, data: Record<string, any>): Promise<void> => {
  await set(ref(db, `users/${userId}`), data);
};

export const getUserData = async (userId: string): Promise<any> => {
  const snapshot = await get(ref(db, `users/${userId}`));
  return snapshot.exists() ? snapshot.val() : null;
};

export const updateUserData = async (userId: string, data: Record<string, any>): Promise<void> => {
  await update(ref(db, `users/${userId}`), data);
};

// Calendar events
export const saveCalendarEvent = async (userId: string, date: string, event: Record<string, any>): Promise<void> => {
  const eventId = Date.now().toString();
  await set(ref(db, `users/${userId}/calendar/${date}/${eventId}`), event);
};

export const getCalendarEvents = async (userId: string, date: string): Promise<any[]> => {
  const snapshot = await get(ref(db, `users/${userId}/calendar/${date}`));
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

export const updateCalendarEvent = async (userId: string, date: string, eventId: string, data: Record<string, any>): Promise<void> => {
  await update(ref(db, `users/${userId}/calendar/${date}/${eventId}`), data);
};

export const deleteCalendarEvent = async (userId: string, date: string, eventId: string): Promise<void> => {
  await remove(ref(db, `users/${userId}/calendar/${date}/${eventId}`));
};

// Notifications
export const saveNotification = async (userId: string, notification: Record<string, any>): Promise<void> => {
  const notificationId = Date.now().toString();
  await set(ref(db, `users/${userId}/notifications/${notificationId}`), notification);
};

export const getNotifications = async (userId: string): Promise<any[]> => {
  const snapshot = await get(ref(db, `users/${userId}/notifications`));
  return snapshot.exists() ? Object.values(snapshot.val()) : [];
};

// Track user settings
export const saveUserSettings = async (userId: string, settings: Record<string, any>): Promise<void> => {
  await set(ref(db, `users/${userId}/settings`), settings);
};

export const getUserSettings = async (userId: string): Promise<any> => {
  const snapshot = await get(ref(db, `users/${userId}/settings`));
  return snapshot.exists() ? snapshot.val() : null;
};

export { auth, db };
