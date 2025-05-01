import CalendarView from "@/components/Calendar/CalendarView";
import QuickActions from "@/components/QuickActions";
import Notifications from "@/components/Notifications";
import AIInsights from "@/components/AIInsights";
import HubsPreview from "@/components/HubsPreview";
import { useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";

const Home = () => {
  const { user, isLoading } = useUser();
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Redirect to profile if not logged in
    if (!isLoading && !user) {
      navigate('/profile');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <CalendarView />
      <QuickActions />
      <Notifications />
      <AIInsights />
      <HubsPreview />
    </>
  );
};

export default Home;
