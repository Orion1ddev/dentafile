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
    <Card className="w-full max-w-4xl mx-auto mb-8 shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="p-8">
        <div className="space-y-3">
          <p className="text-2xl font-medium text-foreground/90">
            {getGreeting()}, Dr. {userProfile?.first_name}.{' '}
            {appointmentCount ? (
              <span className="text-foreground/80">
                {t('you_have')} {appointmentCount} {t('appointments_today')}.
              </span>
            ) : (
              <span className="text-foreground/80">{t('no_appointments_today')}.</span>
            )}
          </p>
          {pinnedPatientsCount > 0 && (
            <p className="text-muted-foreground text-lg">
              {t('you_have')} {pinnedPatientsCount} {t('pinned_patients')}.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};