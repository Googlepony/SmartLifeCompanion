import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassContainer = ({ children, className, onClick }: GlassContainerProps) => {
  return (
    <div 
      className={cn(
        "glass dark:glass-dark rounded-xl p-4 hover:shadow-md transition-all",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
