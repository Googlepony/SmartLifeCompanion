import GlassContainer from "./GlassContainer";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface Hub {
  id: string;
  name: string;
  description: string;
  articles: number;
  gradient: string;
  imageSrc?: string;
}

const HubsPreview = () => {
  const [, navigate] = useLocation();

  const hubs: Hub[] = [
    {
      id: "productivity",
      name: "Productivity",
      description: "Tools and techniques to boost your productivity",
      articles: 14,
      gradient: "from-blue-500 to-blue-700",
      imageSrc: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "finance",
      name: "Finance",
      description: "Personal finance tips and market updates",
      articles: 9,
      gradient: "from-green-500 to-green-700",
      imageSrc: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "mindfulness",
      name: "Mindfulness",
      description: "Meditation guides and mindfulness exercises",
      articles: 7,
      gradient: "from-purple-500 to-purple-700",
      imageSrc: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "learning",
      name: "Learning",
      description: "Educational resources and skill development",
      articles: 12,
      gradient: "from-red-500 to-red-700",
      imageSrc: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <section className="mb-8 fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Your Hubs</h2>
        <Button 
          variant="link" 
          size="sm" 
          className="text-primary"
          onClick={() => navigate("/hubs")}
        >
          View all
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {hubs.map((hub) => (
          <GlassContainer 
            key={hub.id}
            className="p-0 overflow-hidden hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigate(`/hubs/${hub.id}`)}
          >
            <div className={`h-24 bg-gradient-to-r ${hub.gradient} relative`}>
              {hub.imageSrc && (
                <div className="absolute inset-0 w-full h-full bg-black opacity-20"></div>
              )}
              <div className="absolute bottom-3 left-3 text-white font-medium">
                {hub.name}
              </div>
            </div>
            <div className="p-3">
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                <FileText className="h-3 w-3 mr-1" /> {hub.articles} articles
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {hub.description}
              </p>
            </div>
          </GlassContainer>
        ))}
      </div>
    </section>
  );
};

export default HubsPreview;
