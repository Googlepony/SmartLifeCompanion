import { useState } from "react";
import CalendarView from "@/components/Calendar/CalendarView";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, ListTodo, Target, DollarSign } from "lucide-react";
import GlassContainer from "@/components/GlassContainer";

const CalendarPage = () => {
  const { user, isLoading } = useUser();
  const [, navigate] = useLocation();
  const [view, setView] = useState<"month" | "week" | "day">("month");
  
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
          <p>Loading your calendar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> Add Event
        </Button>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as any)} className="mb-6">
        <TabsList>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="day">Day</TabsTrigger>
        </TabsList>
      </Tabs>

      <CalendarView />

      <div className="mt-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-4 gap-4">
          <GlassContainer className="flex flex-col items-center p-6 hover:shadow-lg transition-all cursor-pointer">
            <ListTodo className="h-8 w-8 text-blue-500 mb-3" />
            <span className="font-medium">Tasks</span>
            <span className="text-sm text-gray-500 mt-1">8 items</span>
          </GlassContainer>

          <GlassContainer className="flex flex-col items-center p-6 hover:shadow-lg transition-all cursor-pointer">
            <Target className="h-8 w-8 text-green-500 mb-3" />
            <span className="font-medium">Goals</span>
            <span className="text-sm text-gray-500 mt-1">3 items</span>
          </GlassContainer>

          <GlassContainer className="flex flex-col items-center p-6 hover:shadow-lg transition-all cursor-pointer">
            <DollarSign className="h-8 w-8 text-yellow-500 mb-3" />
            <span className="font-medium">Finance</span>
            <span className="text-sm text-gray-500 mt-1">5 items</span>
          </GlassContainer>

          <GlassContainer className="flex flex-col items-center p-6 hover:shadow-lg transition-all cursor-pointer">
            <Calendar className="h-8 w-8 text-purple-500 mb-3" />
            <span className="font-medium">Notes</span>
            <span className="text-sm text-gray-500 mt-1">12 items</span>
          </GlassContainer>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
