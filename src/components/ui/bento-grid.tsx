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
    <a
      href={href}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl",
        className
      )}
    >
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center justify-between">
          <div>
            {Icon && (
              <Icon className="h-8 w-8 mb-4" />
            )}
            <h3 className="mb-2 font-semibold leading-none tracking-tight">
              {name}
            </h3>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">{description}</p>
        <div className="mt-auto">
          <span className="text-sm font-medium group-hover:text-primary">
            {cta}
          </span>
        </div>
      </div>
      {background}
    </a>
  );
}