import { Particles } from "./ui/particles";
import { useTheme } from "next-themes";

interface LayoutProps {
  children: React.ReactNode;
  excludeParticles?: boolean;
}

export const Layout = ({ children, excludeParticles = false }: LayoutProps) => {
  const { theme } = useTheme();

  return (
    <div className="relative min-h-screen bg-background">
      {!excludeParticles && (
        <Particles
          className="absolute inset-0"
          quantity={50}
          ease={80}
          size={0.5}
          color={theme === "dark" ? "#ffffff" : "#000000"}
          refresh={false}
        />
      )}
      {children}
    </div>
  );
};