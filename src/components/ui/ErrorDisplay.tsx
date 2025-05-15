
import { Button } from "@/components/ui/button";
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  onRetry: () => void;
  message?: string;
  description?: string;
}

export const ErrorDisplay = ({ 
  onRetry, 
  message = "Unable to load data", 
  description = "There was a problem connecting to the database. Please check your connection and try again." 
}: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <BackgroundEffect />
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
        >
          <AlertCircle className="h-16 w-16 text-destructive/70" />
        </motion.div>
        <motion.h2 
          className="text-xl font-semibold mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.h2>
        <motion.p 
          className="mb-6 text-muted-foreground"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {description}
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button 
            onClick={onRetry}
            className="px-6"
          >
            Retry Connection
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};
