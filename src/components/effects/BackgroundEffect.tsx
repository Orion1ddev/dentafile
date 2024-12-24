import { useEffect, useRef } from 'react';
import p5 from 'p5';

export const BackgroundEffect = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let particles: Array<{ x: number; y: number; speed: number }> = [];

      p.setup = () => {
        const canvas = p.createCanvas(window.innerWidth, window.innerHeight);
        canvas.position(0, 0);
        canvas.style('z-index', '-1');
        canvas.style('position', 'fixed');
        
        // Initialize particles
        for (let i = 0; i < 50; i++) {
          particles.push({
            x: p.random(p.width),
            y: p.random(p.height),
            speed: p.random(0.5, 2)
          });
        }
      };

      p.draw = () => {
        p.clear();
        
        // Update and draw particles
        particles.forEach((particle, i) => {
          particle.y -= particle.speed;
          if (particle.y < 0) {
            particle.y = p.height;
            particle.x = p.random(p.width);
          }
          
          p.noStroke();
          p.fill(100, 100, 255, 15);
          p.circle(particle.x, particle.y, 4);
        });
      };

      p.windowResized = () => {
        p.resizeCanvas(window.innerWidth, window.innerHeight);
      };
    };

    const p5Instance = new p5(sketch, containerRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none" />;
};