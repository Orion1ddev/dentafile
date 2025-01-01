import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface BentoGridProps {
  className?: string;
  children: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:auto-rows-[28rem] md:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  className?: string;
  Icon?: LucideIcon;
  name: string;
  description: string;
  href: string;
  cta?: string;
  background?: React.ReactNode;
}

export function BentoCard({
  className,
  Icon,
  name,
  description,
  href,
  cta = "Learn More",
  background,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl",
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div>
            {Icon && (
              <div className="mb-4 rounded-full border bg-background p-3.5 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
            )}
            <h3 className="mb-2 font-semibold leading-none tracking-tight">
              {name}
            </h3>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto">
          <Button
            variant="ghost"
            className="group-hover:bg-primary group-hover:text-primary-foreground"
            onClick={() => window.location.href = href}
          >
            {cta}
          </Button>
        </div>
      </div>
      {background}
    </div>
  );
}