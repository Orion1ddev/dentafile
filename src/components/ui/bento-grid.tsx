import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface BentoCardProps {
  className?: string;
  Icon?: any;
  name?: string;
  description?: string;
  href?: string;
  isWelcomeCard?: boolean;
  welcomeMessage?: React.ReactNode;
}

export function BentoCard({
  className,
  Icon,
  name,
  description,
  href,
  isWelcomeCard,
  welcomeMessage,
}: BentoCardProps) {
  const CardWrapper = href
    ? motion.a
    : motion.div;

  const cardProps = href
    ? {
        href,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {};

  return (
    <CardWrapper
      className={`row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 ${className}`}
      {...cardProps}
      whileHover={href ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {Icon && (
          <div className="flex items-center">
            <Icon className="h-12 w-12" />
          </div>
        )}
        {welcomeMessage}
        {!isWelcomeCard && (
          <div>
            <h3 className="font-medium leading-none tracking-tight text-lg">
              {name}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-2">{description}</p>
            )}
          </div>
        )}
      </div>
    </CardWrapper>
  );
}

interface BentoGridProps {
  className?: string;
  children?: React.ReactNode;
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 lg:auto-rows-[28rem] gap-4 max-w-7xl mx-auto md:p-4 ${className}`}
    >
      {children}
    </div>
  );
}