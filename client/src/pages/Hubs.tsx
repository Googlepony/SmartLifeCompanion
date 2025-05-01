import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useUser } from "@/contexts/UserContext";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlassContainer from "@/components/GlassContainer";
import { FileText, ArrowLeft, Search, Filter } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Hub {
  id: string;
  name: string;
  description: string;
  articles: number;
  gradient: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
}

const HubDetail = ({ hubId }: { hubId: string }) => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Mocked hub data - in a real app this would come from API
  const hub: Hub = {
    id: hubId,
    name: hubId.charAt(0).toUpperCase() + hubId.slice(1),
    description: "Resources and articles to help you improve your skills",
    articles: 14,
    gradient: 
      hubId === "productivity" ? "from-blue-500 to-blue-700" :
      hubId === "finance" ? "from-green-500 to-green-700" :
      hubId === "mindfulness" ? "from-purple-500 to-purple-700" :
      "from-red-500 to-red-700"
  };
  
  // Mocked articles - in a real app this would come from API
  const articles: Article[] = [
    {
      id: "1",
      title: "Getting Started with Time Blocking",
      excerpt: "Learn how to effectively manage your time with the time blocking technique",
      category: "Productivity",
      date: "2 days ago"
    },
    {
      id: "2",
      title: "The Pomodoro Technique Explained",
      excerpt: "A deep dive into the Pomodoro technique and how it can boost your productivity",
      category: "Productivity",
      date: "1 week ago"
    },
    {
      id: "3",
      title: "Building a Second Brain",
      excerpt: "How to organize your digital notes and become more productive",
      category: "Productivity",
      date: "2 weeks ago"
    }
  ];
  
  // Filter articles based on search query
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/hubs")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Hubs
      </Button>
      
      <div className={`h-32 rounded-xl bg-gradient-to-r ${hub.gradient} relative mb-6`}>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <h1 className="text-2xl font-bold text-white">{hub.name}</h1>
          <p className="text-white text-opacity-90">{hub.description}</p>
        </div>
      </div>
      
      <div className="flex items-center mb-6">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search articles..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" /> Filter
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No articles found matching "{searchQuery}"
          </div>
        ) : (
          filteredArticles.map(article => (
            <GlassContainer key={article.id} className="cursor-pointer">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-gray-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium">{article.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="mr-3">{article.category}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </div>
            </GlassContainer>
          ))
        )}
      </div>
    </div>
  );
};

const HubsPage = () => {
  const [, navigate] = useLocation();
  
  const hubs: Hub[] = [
    {
      id: "productivity",
      name: "Productivity",
      description: "Tools and techniques to boost your productivity",
      articles: 14,
      gradient: "from-blue-500 to-blue-700"
    },
    {
      id: "finance",
      name: "Finance",
      description: "Personal finance tips and market updates",
      articles: 9,
      gradient: "from-green-500 to-green-700"
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      description: "Meditation guides and mindfulness exercises",
      articles: 7,
      gradient: "from-purple-500 to-purple-700"
    },
    {
      id: "learning",
      name: "Learning",
      description: "Educational resources and skill development",
      articles: 12,
      gradient: "from-red-500 to-red-700"
    },
    {
      id: "health",
      name: "Health",
      description: "Fitness, nutrition and wellness guides",
      articles: 8,
      gradient: "from-yellow-500 to-yellow-700"
    },
    {
      id: "career",
      name: "Career",
      description: "Career development and job search resources",
      articles: 5,
      gradient: "from-indigo-500 to-indigo-700"
    }
  ];
  
  return (
    <div className="py-4">
      <h1 className="text-2xl font-bold mb-6">Knowledge Hubs</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map(hub => (
          <GlassContainer 
            key={hub.id}
            className="p-0 overflow-hidden hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/hubs/${hub.id}`)}
          >
            <div className={`h-32 bg-gradient-to-r ${hub.gradient} relative`}>
              <div className="absolute bottom-3 left-3 text-white font-medium">
                {hub.name}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <FileText className="h-4 w-4 mr-1" /> {hub.articles} articles
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {hub.description}
              </p>
            </div>
          </GlassContainer>
        ))}
      </div>
    </div>
  );
};

const Hubs = () => {
  const { user, isLoading } = useUser();
  const [, navigate] = useLocation();
  const params = useParams();
  const hubId = params.hubId;
  
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
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return hubId ? <HubDetail hubId={hubId} /> : <HubsPage />;
};

export default Hubs;
