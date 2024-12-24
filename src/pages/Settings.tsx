import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSettings } from "@/components/settings/PersonalInfoSettings";
import { PasswordSettings } from "@/components/settings/PasswordSettings";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import { useLanguage } from "@/stores/useLanguage";

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t('settings')}</h1>
      
      <Tabs defaultValue="personal" className="w-full max-w-3xl mx-auto">
        <TabsList className="w-full">
          <TabsTrigger value="personal">{t('personal_info')}</TabsTrigger>
          <TabsTrigger value="password">{t('password')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <PersonalInfoSettings />
        </TabsContent>
        
        <TabsContent value="password">
          <PasswordSettings />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-4 right-4">
        <BuyMeCoffeeButton />
      </div>
    </div>
  );
};

export default Settings;