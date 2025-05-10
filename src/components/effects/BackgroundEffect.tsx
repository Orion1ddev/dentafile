
import { useRef } from 'react';

export const BackgroundEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] opacity-100">
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm"></div>
      <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-400"></div>
    </div>
  );
};
