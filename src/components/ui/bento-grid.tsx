import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface BentoCardProps {
  className?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  name?: string;
  description?: string;
  href?: string;
  cta?: string;
  isWelcomeCard?: boolean;
  welcomeMessage?: React.ReactNode;
}

export function BentoCard({
  className,
  Icon,
  name,
  description,
  href,
  cta,
  isWelcomeCard,
  welcomeMessage,
}: BentoCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isWelcomeCard) {
      return (
        <div className={cn(
          "group relative overflow-hidden rounded-lg border bg-background p-6",
          className
        )}>
          {children}
        </div>
      );
    }

    return (
      <Link
        to={href || "#"}
        className={cn(
          "group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-xl",
          className
        )}
      >
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <div className="relative z-10 space-y-4">
        {Icon && !isWelcomeCard && (
          <Icon className="h-12 w-12 transition-transform group-hover:scale-110" />
        )}
        {Icon && isWelcomeCard && (
          <div className="flex justify-end">
            <Icon className="h-12 w-12" />
          </div>
        )}
        {welcomeMessage}
        {!isWelcomeCard && (
          <>
            <div>
              <h3 className="font-medium leading-none tracking-tight text-lg">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            </div>
            {cta && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary">{cta}</span>
              </div>
            )}
          </>
        )}
      </div>
    </CardWrapper>
  );
}

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}