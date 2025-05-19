
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  mode?: "slide" | "fade" | "scale";
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <div className={cn("w-full", className)}>
      {children}
    </div>
  );
};
