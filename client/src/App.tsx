import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import CalendarPage from "@/pages/CalendarPage";
import Hubs from "@/pages/Hubs";
import Learn from "@/pages/Learn";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import SearchOverlay from "@/components/SearchOverlay";
import { useEffect, useState } from "react";
import { useTheme } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/hubs" component={Hubs} />
      <Route path="/learn" component={Learn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100 transition-colors duration-300">
          <Header onSearchOpen={() => setIsSearchVisible(true)} />
          <main className="flex-1 px-4 pt-4 pb-20 max-w-5xl mx-auto w-full">
            <Router />
          </main>
          <BottomNavigation />
          {isSearchVisible && <SearchOverlay onClose={() => setIsSearchVisible(false)} />}
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
