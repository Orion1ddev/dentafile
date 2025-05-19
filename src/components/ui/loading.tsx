
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeMap = {
  small: 'h-4 w-4',
  medium: 'h-6 w-6',
  large: 'h-10 w-10'
} as const;

export const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  className
}: LoadingProps) => {
  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-background/50 fixed inset-0 z-50" 
    : "flex items-center justify-center py-4";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Loader2 className={cn(sizeMap[size], "text-primary")} />
        </div>
        
        {text && (
          <p className="text-sm text-muted-foreground">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};
