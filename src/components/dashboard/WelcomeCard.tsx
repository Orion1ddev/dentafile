import { useLanguage } from "@/stores/useLanguage";
import { DayCycle } from "./DayCycle";

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
    <div className="h-full flex flex-col justify-between p-6 bg-gradient-to-br from-background/50 to-background/10 backdrop-blur-sm rounded-lg border">
      <div className="space-y-4">
        <h2 className="text-3xl font-semibold text-foreground/90 tracking-tight">
          {getGreeting()}, 
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {" "}Dr. {userProfile?.first_name}
          </span>
        </h2>
        <div className="space-y-2">
          {appointmentCount ? (
            <p className="text-xl text-foreground/80">
              {t('you_have')} {appointmentCount} {t('appointments_today')}.
            </p>
          ) : (
            <p className="text-xl text-foreground/80">{t('no_appointments_today')}.</p>
          )}
          {pinnedPatientsCount > 0 && (
            <p className="text-muted-foreground">
              {t('you_have')} {pinnedPatientsCount} {t('pinned_patients')}.
            </p>
          )}
        </div>
      </div>
      <DayCycle />
    </div>
  );
};