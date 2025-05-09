
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
  className?: string;
}

export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  className 
}: FeatureCardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-lg group",
        onClick && "cursor-pointer transform hover:-translate-y-1",
        className
      )}
      onClick={onClick}
    >
      <div className="h-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 group-hover:opacity-80 transition-opacity" />
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
          <div className="h-6 w-6 text-primary group-hover:text-primary group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          </div>
          <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
