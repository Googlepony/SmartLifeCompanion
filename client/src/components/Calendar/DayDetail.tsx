import { format } from "date-fns";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Plus } from "lucide-react";
import GlassContainer from "../GlassContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DayDetailProps {
  date: Date;
}

type TaskCategory = "Tasks" | "Notes" | "Goals" | "Finance";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  category: TaskCategory;
}

const DayDetail = ({ date }: DayDetailProps) => {
  const [activeCategory, setActiveCategory] = useState<TaskCategory>("Tasks");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [showNewTaskInput, setShowNewTaskInput] = useState(false);
  const { user } = useUser();
  const dateStr = format(date, "yyyy-MM-dd");

  // Fetch tasks for the selected date
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['/api/calendar/day', user?.uid, dateStr],
    enabled: !!user?.uid,
  });

  // Filter tasks by active category
  const filteredTasks = Array.isArray(tasks) 
    ? tasks.filter((task: Task) => task.category === activeCategory)
    : [];

  // Add new task
  const addTaskMutation = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id'>) => {
      return apiRequest('POST', `/api/calendar/task`, {
        userId: user?.uid,
        date: dateStr,
        ...taskData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/day', user?.uid, dateStr] });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar', user?.uid, format(date, 'yyyy-MM')] });
      setNewTaskTitle("");
      setShowNewTaskInput(false);
    }
  });

  // Toggle task completion
  const toggleTaskMutation = useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string, completed: boolean }) => {
      return apiRequest('PATCH', `/api/calendar/task/${taskId}`, {
        userId: user?.uid,
        date: dateStr,
        completed
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/day', user?.uid, dateStr] });
    }
  });

  const handleNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    addTaskMutation.mutate({
      title: newTaskTitle,
      completed: false,
      category: activeCategory,
      time: `${format(new Date(), 'hh:mm a')} - ${format(new Date(Date.now() + 3600000), 'hh:mm a')}`
    });
  };

  return (
    <GlassContainer className="slide-up">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{format(date, "MMMM d, yyyy")}</h3>
        <div className="flex space-x-2">
          {["Tasks", "Notes", "Goals", "Finance"].map((category) => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? "default" : "outline"}
              className={`text-xs rounded-full ${
                activeCategory === category 
                  ? "bg-primary bg-opacity-90 text-primary-foreground" 
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setActiveCategory(category as TaskCategory)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading...</div>
        ) : filteredTasks.length === 0 && !showNewTaskInput ? (
          <div className="py-4 text-center text-gray-500">No {activeCategory.toLowerCase()} for this day</div>
        ) : (
          filteredTasks.map((task: Task) => (
            <div key={task.id} className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Checkbox 
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={(checked) => 
                  toggleTaskMutation.mutate({ 
                    taskId: task.id, 
                    completed: checked as boolean 
                  })
                }
                className="h-5 w-5 rounded-md border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
              />
              <div className="ml-3 flex-1">
                <p className={`text-sm ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : ""}`}>
                  {task.title}
                </p>
                {task.time && (
                  <p className="text-xs text-gray-400 dark:text-gray-500">{task.time}</p>
                )}
              </div>
              <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))
        )}

        {showNewTaskInput ? (
          <div className="flex items-center gap-2 mt-2">
            <Input
              type="text"
              placeholder={`Add new ${activeCategory.toLowerCase().slice(0, -1)}...`}
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNewTask()}
              autoFocus
              className="flex-1"
            />
            <Button size="sm" onClick={handleNewTask}>Add</Button>
            <Button size="sm" variant="outline" onClick={() => setShowNewTaskInput(false)}>Cancel</Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full mt-2 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => setShowNewTaskInput(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add new {activeCategory.toLowerCase().slice(0, -1)}
          </Button>
        )}
      </div>
    </GlassContainer>
  );
};

export default DayDetail;
