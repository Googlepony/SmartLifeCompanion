import GlassContainer from "./GlassContainer";
import { Droplet, Dumbbell, Lightbulb, Volleyball } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuickAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  action: () => void;
}

const QuickActions = () => {
  const { toast } = useToast();
  const { user } = useUser();

  // Log quick action
  const logActionMutation = useMutation({
    mutationFn: async (actionId: string) => {
      return apiRequest('POST', '/api/quick-actions/log', {
        userId: user?.uid,
        actionId,
        timestamp: new Date().toISOString()
      });
    }
  });

  const handleActionClick = (action: QuickAction) => {
    action.action();
    logActionMutation.mutate(action.id);
  };

  const quickActions: QuickAction[] = [
    {
      id: "water-intake",
      name: "Water Intake",
      icon: <Droplet className="h-5 w-5" />,
      bgColor: "bg-blue-100 dark:bg-blue-900",
      iconColor: "text-blue-500",
      action: () => toast({
        title: "Water intake logged",
        description: "Stay hydrated! Remember to drink water regularly."
      })
    },
    {
      id: "meditate",
      name: "Meditate",
      icon: <Volleyball className="h-5 w-5" />,
      bgColor: "bg-purple-100 dark:bg-purple-900",
      iconColor: "text-purple-500",
      action: () => toast({
        title: "Meditation reminder",
        description: "Take a moment to breathe and center yourself."
      })
    },
    {
      id: "workout",
      name: "Workout",
      icon: <Dumbbell className="h-5 w-5" />,
      bgColor: "bg-green-100 dark:bg-green-900",
      iconColor: "text-green-500",
      action: () => toast({
        title: "Workout reminder",
        description: "Time to get moving and stay active!"
      })
    },
    {
      id: "daily-tip",
      name: "Daily Tip",
      icon: <Lightbulb className="h-5 w-5" />,
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
      iconColor: "text-yellow-500",
      action: () => toast({
        title: "Daily Tip",
        description: "Focus on one task at a time for better productivity and results."
      })
    }
  ];

  return (
    <section className="mb-8 fade-in">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <GlassContainer 
            key={action.id}
            className="p-3 flex flex-col items-center justify-center aspect-square cursor-pointer"
            onClick={() => handleActionClick(action)}
          >
            <div className={`${action.bgColor} p-2 rounded-full mb-2`}>
              <span className={action.iconColor}>{action.icon}</span>
            </div>
            <span className="text-xs text-center">{action.name}</span>
          </GlassContainer>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
