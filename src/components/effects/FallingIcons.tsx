
interface FallingIconProps {
  iconType?: "tooth" | "tools";
  left: string;
  delay: string;
  duration: string;
}

const FallingIcon = ({ iconType = "tooth", left, delay, duration }: FallingIconProps) => {
  const iconSrc = iconType === "tooth" 
    ? "/lovable-uploads/8352edea-6585-4245-80e1-e9058d16e7be.png"
    : "/lovable-uploads/59206af8-de49-412c-95ca-b26114eeb916.png";

  return (
    <div 
      className="absolute animate-fall"
      style={{ 
        left,
        top: '-50px',
        animationDelay: delay,
        animationDuration: duration,
        animationIterationCount: 'infinite'
      }}
    >
      <img 
        src={iconSrc} 
        alt="Dental icon" 
        className="w-8 h-8 opacity-50 filter brightness-0 invert"
      />
    </div>
  );
};

export const FallingIcons = () => {
  // Create an array of icons with varied positions, delays and durations
  const icons = [
    { id: 1, type: "tooth", left: "10%", delay: "0s", duration: "15s" },
    { id: 2, type: "tools", left: "25%", delay: "2s", duration: "18s" },
    { id: 3, type: "tooth", left: "35%", delay: "0.7s", duration: "12s" },
    { id: 4, type: "tools", left: "48%", delay: "1.2s", duration: "20s" },
    { id: 5, type: "tooth", left: "60%", delay: "3.1s", duration: "17s" },
    { id: 6, type: "tools", left: "75%", delay: "0.3s", duration: "13s" },
    { id: 7, type: "tooth", left: "85%", delay: "2.5s", duration: "16s" },
    { id: 8, type: "tools", left: "15%", delay: "4s", duration: "19s" },
    { id: 9, type: "tooth", left: "40%", delay: "1.8s", duration: "14s" },
    { id: 10, type: "tools", left: "65%", delay: "0.5s", duration: "16s" },
    { id: 11, type: "tooth", left: "90%", delay: "1.5s", duration: "18s" },
    { id: 12, type: "tools", left: "5%", delay: "3.5s", duration: "15s" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map((icon) => (
        <FallingIcon 
          key={icon.id}
          iconType={icon.type as "tooth" | "tools"} 
          left={icon.left} 
          delay={icon.delay}
          duration={icon.duration}
        />
      ))}
    </div>
  );
};
