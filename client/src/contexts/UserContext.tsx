import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "firebase/auth";
import { auth, handleRedirectResult, getUserData } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

// Check if we have Firebase configuration
const hasFirebaseConfig = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID && 
  import.meta.env.VITE_FIREBASE_APP_ID;

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  userSettings: Record<string, any>;
  setUserSettings: (settings: Record<string, any>) => void;
  mockMode: boolean;
}

const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  userSettings: {},
  setUserSettings: () => {},
  mockMode: !hasFirebaseConfig,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userSettings, setUserSettings] = useState<Record<string, any>>({});
  const { toast } = useToast();
  const mockMode = !hasFirebaseConfig;

  // Initialize mock user immediately if we're in mock mode
  useEffect(() => {
    if (mockMode) {
      // Use a short timeout to avoid React state update warnings
      setTimeout(() => {
        const demoUser = {
          uid: 'demo-user-id',
          displayName: 'Demo User',
          email: 'demo@example.com',
          photoURL: null,
        } as User;
        
        setUser(demoUser);
        setUserSettings({
          theme: 'light',
          notifications: true,
        });
        setIsLoading(false);
      }, 100);
      
      return;
    }

    // Handle redirect result from Google authentication
    const checkRedirectResult = async () => {
      try {
        const redirectUser = await handleRedirectResult();
        if (redirectUser) {
          setUser(redirectUser);
        }
      } catch (error) {
        console.error("Error handling redirect:", error);
        toast({
          title: "Authentication Error",
          description: "There was a problem signing you in.",
          variant: "destructive",
        });
      }
    };

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        try {
          // Fetch user settings
          const userData = await getUserData(authUser.uid);
          if (userData && userData.settings) {
            setUserSettings(userData.settings);
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      }
      
      setIsLoading(false);
    });

    checkRedirectResult();

    return () => unsubscribe();
  }, [toast, mockMode]);

  return (
    <UserContext.Provider value={{ user, isLoading, userSettings, setUserSettings, mockMode }}>
      {children}
    </UserContext.Provider>
  );
};
