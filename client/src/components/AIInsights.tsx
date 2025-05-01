import { useEffect, useState } from "react";
import GlassContainer from "./GlassContainer";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const AIInsights = () => {
  const { user } = useUser();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const { data: insight, isLoading, refetch } = useQuery({
    queryKey: ['/api/ai/insights', user?.uid],
    enabled: !!user?.uid,
  });

  useEffect(() => {
    if (selectedOption) {
      // In a real app, this would send the selection to the API
      const timer = setTimeout(() => {
        refetch();
        setSelectedOption(null);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedOption, refetch]);

  if (isLoading) {
    return (
      <section className="mb-8 fade-in">
        <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
        <GlassContainer className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full mt-2" />
              <Skeleton className="h-4 w-full mt-1" />
              <Skeleton className="h-4 w-3/4 mt-1" />
              <div className="mt-3 flex space-x-2">
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-full" />
              </div>
            </div>
          </div>
        </GlassContainer>
      </section>
    );
  }

  const options = insight?.options || [
    "Research help",
    "Coding tips",
    "Reschedule"
  ];

  return (
    <section className="mb-8 fade-in">
      <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
      <GlassContainer className="bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white">
              <Brain className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">Personal AI Assistant</h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">Active</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              {insight?.message || 
               "Based on your calendar, I suggest focusing on the React project today. Would you like me to help with research or coding tips?"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="secondary" 
                  size="sm"
                  className={`text-xs bg-white dark:bg-gray-800 hover:shadow-md transition-shadow ${
                    selectedOption === option ? 'bg-primary/20 border-primary' : ''
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </GlassContainer>
    </section>
  );
};

export default AIInsights;
