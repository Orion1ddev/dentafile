import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const DayCycle = () => {
  const [position, setPosition] = useState(0);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      // Calculate position (0-180 degrees for the visible half-circle)
      const totalMinutes = hours * 60 + minutes;
      const percentage = (totalMinutes / 1440) * 360; // 1440 is minutes in a day
      const adjustedPosition = percentage <= 180 ? percentage : percentage - 180;
      
      setPosition(adjustedPosition);
      setIsDay(hours >= 6 && hours < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-32 h-16 mx-auto">
      <div className="absolute w-full h-32 bottom-0 overflow-hidden">
        <div className="absolute w-32 h-32 rounded-full border-2 border-primary/20 bottom-0 left-0" />
        <div 
          className="absolute w-8 h-8 -ml-4 flex items-center justify-center"
          style={{
            left: '50%',
            bottom: '16px',
            transform: `rotate(${position}deg) translateY(-48px)`
          }}
        >
          {isDay ? (
            <Sun className="w-6 h-6 text-yellow-500 animate-pulse" />
          ) : (
            <Moon className="w-6 h-6 text-blue-400 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};