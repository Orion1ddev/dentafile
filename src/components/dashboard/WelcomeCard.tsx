import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/stores/useLanguage";

interface WelcomeCardProps {
  userProfile: any;
  appointmentCount: number;
  pinnedPatientsCount: number;
}

export const WelcomeCard = ({ userProfile, appointmentCount, pinnedPatientsCount }: WelcomeCardProps) => {
  const { t } = useLanguage();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('good_morning');
    if (hour < 18) return t('good_afternoon');
    return t('good_evening');
  };

  return (
    <div className="mb-4">
      <div className="space-y-3">
        <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient">
          {getGreeting()}, Dr. {userProfile?.first_name}.{' '}
        </p>
        <p className="text-lg text-foreground/80">
          {appointmentCount ? (
            <span>
              {t('you_have')} {appointmentCount} {t('appointments_today')}.
            </span>
          ) : (
            <span>{t('no_appointments_today')}.</span>
          )}
        </p>
        {pinnedPatientsCount > 0 && (
          <p className="text-muted-foreground">
            {t('you_have')} {pinnedPatientsCount} {t('pinned_patients')}.
          </p>
        )}
      </div>
    </div>
  );
};