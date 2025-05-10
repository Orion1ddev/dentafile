
import { BackgroundEffect } from "@/components/effects/BackgroundEffect";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen">
      <BackgroundEffect />
      <main className="container mx-auto py-8 px-2 sm:px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
