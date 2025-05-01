import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

interface SearchOverlayProps {
  onClose: () => void;
}

const SearchOverlay = ({ onClose }: SearchOverlayProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }

    // Focus the input when overlay opens
    inputRef.current?.focus();

    // Add escape key listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    const searches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery),
    ].slice(0, 5);
    
    setRecentSearches(searches);
    localStorage.setItem("recentSearches", JSON.stringify(searches));
    
    // Here you would typically perform the actual search
    console.log("Searching for:", searchQuery);
    
    // Close overlay
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-start justify-center pt-24"
      onClick={handleOverlayClick}
    >
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="glass dark:glass-dark rounded-xl p-4">
          <div className="flex items-center mb-4">
            <Search className="text-gray-400 mr-2 h-5 w-5" />
            <Input 
              ref={inputRef}
              type="text" 
              placeholder="Search across all your content..." 
              className="bg-transparent border-none w-full focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              variant="ghost" 
              className="text-sm text-gray-500 dark:text-gray-400 ml-2"
              onClick={onClose}
            >
              ESC
            </Button>
          </div>
          
          {recentSearches.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">RECENT SEARCHES</div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge 
                    key={index} 
                    variant="outline"
                    className="text-xs bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSearchQuery(search)}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
