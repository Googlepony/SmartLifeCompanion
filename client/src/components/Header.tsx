import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/contexts/NotificationContext";

interface HeaderProps {
  onSearchOpen: () => void;
}

const Header = ({ onSearchOpen }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const { unreadCount } = useNotifications();

  return (
    <header className="glass dark:glass-dark sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Super
          </span>
          <span className="text-xl">Assistant</span>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onSearchOpen}
        >
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 bg-red-500 text-white h-5 w-5 flex items-center justify-center p-0"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Avatar className="h-8 w-8 bg-gradient-to-r from-primary to-secondary">
          <AvatarImage
            src={user?.photoURL || undefined}
            alt={user?.displayName || "User"}
          />
          <AvatarFallback>
            {user?.displayName?.[0] || user?.email?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
