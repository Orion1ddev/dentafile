import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface DashboardItemProps {
  title: string;
  icon: LucideIcon;
  description: string;
  onClick?: () => void;
  count?: number | null;
}

interface DashboardGridProps {
  items: DashboardItemProps[];
}

export const DashboardGrid = ({ items }: DashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <Card 
          key={item.title}
          className={`hover:shadow-lg transition-shadow ${item.onClick ? 'cursor-pointer' : ''}`}
          onClick={item.onClick}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {item.count !== null ? item.count : ""}
            </div>
            <p className="text-xs text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};