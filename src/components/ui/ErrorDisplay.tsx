
import { Button } from "@/components/ui/button";
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";

interface ErrorDisplayProps {
  onRetry: () => void;
}

export const ErrorDisplay = ({ onRetry }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <BackgroundEffect />
      <div className="text-center max-w-md">
        <h2 className="text-xl font-semibold mb-4">Unable to load data</h2>
        <p className="mb-6 text-muted-foreground">There was a problem connecting to the database. Please check your connection and try again.</p>
        <Button onClick={onRetry}>
          Retry Connection
        </Button>
      </div>
    </div>
  );
};
