
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/stores/useLanguage";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export const BackButton = ({ 
  to = "/", 
  label, 
  className = "text-muted-foreground hover:text-foreground" 
}: BackButtonProps) => {
  const { t } = useLanguage();
  const ariaLabel = label || t('back_to_dashboard');
  
  return (
    <Button variant="ghost" size="icon" asChild className={className} aria-label={ariaLabel}>
      <Link to={to}>
        <ChevronLeft className="h-4 w-4" />
      </Link>
    </Button>
  );
};
