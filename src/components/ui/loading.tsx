
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
    ? "min-h-screen flex items-center justify-center bg-background/95 backdrop-blur-sm fixed inset-0 z-50" 
    : "flex items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="bg-card/90 backdrop-blur-sm border rounded-lg shadow-lg p-6 flex flex-col items-center gap-4 max-w-md">
        <div className="relative">
          <Loader2 className={`${sizeMap[size]} text-primary animate-spin`} />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-pulse rounded-full" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-medium">{text}</h3>
          <p className="text-sm text-muted-foreground">Please wait while we load your data</p>
        </div>

        <div className="w-full bg-muted rounded-full h-1 mt-2 overflow-hidden">
          <div className="bg-primary h-1 animate-[pulse_2s_ease-in-out_infinite] w-1/2" />
        </div>
      </div>
    </div>
  );
};
