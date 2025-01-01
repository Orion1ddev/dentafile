import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

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
  welcomeMessage?: React.ReactNode;
}

export function BentoCard({
  className,
  Icon,
  name,
  description,
  href,
  cta = "Learn More",
  background,
  welcomeMessage,
}: BentoCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl hover:scale-[1.02] hover:bg-accent/5",
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            {Icon && (
              <Icon className="h-12 w-12 transition-transform group-hover:scale-110" />
            )}
            <h3 className="font-semibold leading-none tracking-tight">
              {name}
            </h3>
          </div>
        </div>
        {welcomeMessage}
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto">
          <span className="text-sm font-medium text-foreground/80 transition-colors group-hover:text-primary">
            {cta}
          </span>
        </div>
      </div>
      {background}
    </a>
  );
}