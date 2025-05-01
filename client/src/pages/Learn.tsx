import { useUser } from "@/contexts/UserContext";
import { useLocation } from "wouter";
import { useEffect } from "react";
import GlassContainer from "@/components/GlassContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, TrendingUp, Brain, Heart, Play } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lessons: number;
  icon: React.ReactNode;
  category: string;
}

const Learn = () => {
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
          <p>Loading learning resources...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Sample courses data
  const courses: Course[] = [
    {
      id: "1",
      title: "Mastering Productivity",
      description: "Learn essential productivity techniques to maximize your efficiency",
      progress: 65,
      lessons: 12,
      icon: <BookOpen className="h-5 w-5" />,
      category: "productivity"
    },
    {
      id: "2",
      title: "Web Development Fundamentals",
      description: "Learn the basics of HTML, CSS, and JavaScript",
      progress: 30,
      lessons: 24,
      icon: <Code className="h-5 w-5" />,
      category: "coding"
    },
    {
      id: "3",
      title: "Investment Strategies",
      description: "Understand the basics of investing and portfolio management",
      progress: 15,
      lessons: 18,
      icon: <TrendingUp className="h-5 w-5" />,
      category: "finance"
    },
    {
      id: "4",
      title: "Mindfulness Meditation",
      description: "Develop a daily meditation practice for better mental health",
      progress: 42,
      lessons: 10,
      icon: <Brain className="h-5 w-5" />,
      category: "mindfulness"
    },
    {
      id: "5",
      title: "Fitness Fundamentals",
      description: "Build a sustainable fitness routine for long-term health",
      progress: 20,
      lessons: 15,
      icon: <Heart className="h-5 w-5" />,
      category: "health"
    }
  ];

  return (
    <div className="py-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Learning Center</h1>
        <p className="text-gray-600 dark:text-gray-400">Continue your learning journey</p>
      </div>

      <GlassContainer className="mb-8">
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold">Continue Learning</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              You were learning about productivity techniques. Continue where you left off!
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>65%</span>
              </div>
              <Progress value={65} className="h-2" />
              <Button className="mt-4 w-full sm:w-auto">
                <Play className="h-4 w-4 mr-2" /> Continue Learning
              </Button>
            </div>
          </div>
        </div>
      </GlassContainer>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="inprogress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                      ${course.category === 'productivity' ? 'bg-blue-100 text-blue-500' : 
                        course.category === 'coding' ? 'bg-purple-100 text-purple-500' : 
                        course.category === 'finance' ? 'bg-green-100 text-green-500' : 
                        course.category === 'mindfulness' ? 'bg-yellow-100 text-yellow-500' : 
                        'bg-red-100 text-red-500'} 
                      dark:bg-opacity-20`}>
                      {course.icon}
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{course.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {course.lessons} lessons
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inprogress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.filter(c => c.progress > 0 && c.progress < 100).map(course => (
              <Card key={course.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 
                      ${course.category === 'productivity' ? 'bg-blue-100 text-blue-500' : 
                        course.category === 'coding' ? 'bg-purple-100 text-purple-500' : 
                        course.category === 'finance' ? 'bg-green-100 text-green-500' : 
                        course.category === 'mindfulness' ? 'bg-yellow-100 text-yellow-500' : 
                        'bg-red-100 text-red-500'} 
                      dark:bg-opacity-20`}>
                      {course.icon}
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{course.description}</CardDescription>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {course.lessons} lessons
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Continue
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            You haven't completed any courses yet.
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-8 text-gray-500">
            You haven't saved any courses yet.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Learn;
