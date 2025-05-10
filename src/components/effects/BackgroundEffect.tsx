
import { useRef } from 'react';

export const BackgroundEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[-1] opacity-90">
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 to-background/80 backdrop-blur-sm"></div>
      <img 
        src="/lovable-uploads/80455b65-fd19-4ef9-a28a-897ea19a0a1a.png" 
        alt="Geometric Background" 
        className="w-full h-full object-cover mix-blend-screen opacity-70"
      />
    </div>
  );
};
