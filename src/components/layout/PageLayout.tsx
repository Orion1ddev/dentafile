
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen relative">
      <BackgroundEffect />
      <main className="container mx-auto py-4 px-1 sm:px-2 lg:px-3 relative z-10">
        <div className="max-w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
