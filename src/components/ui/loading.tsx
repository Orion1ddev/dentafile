import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
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
    ? "min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50" 
    : "flex items-center justify-center py-4";

  return (
    <div className={cn(containerClasses, className)}>
      <motion.div 
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            ease: "linear",
            repeatDelay: 0 
          }}
        >
          <Loader2 className={cn(sizeMap[size], "text-primary animate-pulse")} />
        </motion.div>
        
        {text && (
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {text}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
