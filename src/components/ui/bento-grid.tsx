import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
const BentoGrid = ({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}>
      {children}
    </div>;
};
const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta
}: {
  name: string;
  className: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => {
  // If there's no href, treat it as a static card (welcome card)
  const isStaticCard = !href;
  return <div key={name} className="">
      <div>{background}</div>
      <div className={cn("z-10 flex transform-gpu flex-col gap-1 p-6",
    // Only apply hover animation if it's not a static card
    !isStaticCard && "pointer-events-none transition-all duration-300 group-hover:-translate-y-10")}>
        <Icon className={cn("h-12 w-12 origin-left transform-gpu text-neutral-700",
      // Only apply hover animation if it's not a static card
      !isStaticCard && "transition-all duration-300 ease-in-out group-hover:scale-75")} />
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>

      {!isStaticCard && <div className="pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button variant="ghost" asChild size="sm" className="pointer-events-auto">
            <a href={href}>
              {cta}
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>}
      
      {!isStaticCard && <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03] group-hover:dark:bg-neutral-800/10" />}
    </div>;
};
export { BentoCard, BentoGrid };