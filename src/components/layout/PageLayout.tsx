
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  withBackground?: boolean;
}

export const PageLayout = ({ children, withBackground = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm relative">
      {withBackground && <BackgroundEffect />}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};
