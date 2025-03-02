
import { Loader2 } from "lucide-react";

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}: LoadingProps) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-10 w-10'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50 transition-opacity duration-300 animate-fade-in" 
    : "flex items-center justify-center py-4 transition-opacity duration-300 animate-fade-in";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3 animate-[pulse_3s_ease-in-out_infinite]">
        <div className="relative">
          <Loader2 className={`${sizeMap[size]} text-primary animate-spin`} />
        </div>
        
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
        )}
      </div>
    </div>
  );
};
