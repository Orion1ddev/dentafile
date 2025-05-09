
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaticImageData } from "next/image";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, YAxis } from "recharts";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  chartData?: { date: string; value: number }[];
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  description,
  icon,
  chartData,
  trend = "neutral",
  className,
}: StatsCardProps) => {
  // Determine trend color
  const trendColor = 
    trend === "up" ? "text-emerald-500" : 
    trend === "down" ? "text-rose-500" : 
    "text-muted-foreground";

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold">{value}</div>
          {trend !== "neutral" && (
            <span className={`text-xs ${trendColor}`}>
              {trend === "up" ? "↑" : "↓"} 
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground pt-1">
            {description}
          </p>
        )}
        
        {chartData && chartData.length > 0 && (
          <div className="h-[50px] mt-3">
            <ChartContainer 
              className="h-full w-full" 
              config={{
                data: { theme: { light: "#68b7dd", dark: "#4298c7" } },
              }}
            >
              <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-data)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-data)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <YAxis hide domain={['dataMin', 'dataMax']} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-data)" 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
