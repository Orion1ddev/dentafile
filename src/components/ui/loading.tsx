
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

export const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  className
}: LoadingProps) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-10 w-10'
  };

  const containerClasses = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-sm fixed inset-0 z-50 transition-opacity duration-300" 
    : "flex items-center justify-center py-4 transition-opacity duration-300";

  return (
    <div className={cn(containerClasses, className)}>
      <motion.div 
        className="flex flex-col items-center gap-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className="relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizeMap[size]} text-primary`} />
        </motion.div>
        
        {text && (
          <motion.p 
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};
