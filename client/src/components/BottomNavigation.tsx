import { Home, Calendar, PlusCircle, GraduationCap, User } from "lucide-react";
import { useLocation } from "wouter";

const BottomNavigation = () => {
  const [location, navigate] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const NavItem = ({ path, icon, label }: { path: string, icon: React.ReactNode, label: string }) => {
    return (
      <div 
        onClick={() => navigate(path)}
        className={`flex flex-col items-center justify-center p-2 cursor-pointer ${isActive(path) ? "text-primary" : "text-gray-500 dark:text-gray-400"}`}
      >
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </div>
    );
  };

  return (
    <nav className="glass dark:glass-dark fixed bottom-0 w-full z-40 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-around py-2">
          <NavItem 
            path="/" 
            icon={<Home className="h-5 w-5" />} 
            label="Home" 
          />
          
          <NavItem 
            path="/calendar" 
            icon={<Calendar className="h-5 w-5" />} 
            label="Calendar" 
          />
          
          <div className="relative">
            <button className="absolute -top-6 left-1/2 transform -translate-x-1/2 h-12 w-12 rounded-full gradient-bg flex items-center justify-center shadow-lg text-white">
              <PlusCircle className="h-6 w-6" />
            </button>
          </div>
          
          <NavItem 
            path="/learn" 
            icon={<GraduationCap className="h-5 w-5" />} 
            label="Learn" 
          />
          
          <NavItem 
            path="/profile" 
            icon={<User className="h-5 w-5" />} 
            label="Profile" 
          />
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
