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
    <Card className="mb-6">
      <CardContent className="pt-6">
        <p className="text-xl">
          {getGreeting()}, Dr. {userProfile?.first_name}.{' '}
          {appointmentCount ? (
            <span>
              {t('you_have')} {appointmentCount} {t('appointments_today')}.
            </span>
          ) : (
            <span>{t('no_appointments_today')}.</span>
          )}
          {pinnedPatientsCount > 0 && (
            <span className="block mt-2 text-muted-foreground">
              {t('you_have')} {pinnedPatientsCount} {t('pinned_patients')}.
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  );
};