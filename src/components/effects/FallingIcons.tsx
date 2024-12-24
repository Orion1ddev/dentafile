interface FallingIconProps {
  delay?: string;
  iconType?: "tooth" | "tools";
  left?: string;
}

const FallingIcon = ({ delay = "0s", iconType = "tooth", left = "50%" }: FallingIconProps) => {
  const iconSrc = iconType === "tooth" 
    ? "/lovable-uploads/8352edea-6585-4245-80e1-e9058d16e7be.png"
    : "/lovable-uploads/59206af8-de49-412c-95ca-b26114eeb916.png";

  return (
    <div 
      className="absolute animate-fall"
      style={{ 
        animationDelay: delay,
        left,
        top: '-50px'
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
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <FallingIcon delay="0s" iconType="tooth" left="20%" />
      <FallingIcon delay="2s" iconType="tools" left="40%" />
      <FallingIcon delay="4s" iconType="tooth" left="60%" />
      <FallingIcon delay="6s" iconType="tools" left="80%" />
      <FallingIcon delay="8s" iconType="tooth" left="30%" />
      <FallingIcon delay="10s" iconType="tools" left="70%" />
    </div>
  );
};