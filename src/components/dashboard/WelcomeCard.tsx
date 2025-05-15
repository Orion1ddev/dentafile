
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/stores/useLanguage";
import { motion } from "framer-motion";

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
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="space-y-3">
        <motion.p 
          className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-gradient"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {getGreeting()}, Dr. {userProfile?.first_name}.{' '}
        </motion.p>
        <motion.p 
          className="text-xl text-foreground/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {appointmentCount ? (
            <span>
              {t('you_have')} <span className="font-semibold">{appointmentCount}</span> {t('appointments_today')}.
            </span>
          ) : (
            <span>{t('no_appointments_today')}.</span>
          )}
        </motion.p>
        {pinnedPatientsCount > 0 && (
          <motion.p 
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            {t('you_have')} {pinnedPatientsCount} {t('pinned_patients')}.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};
