
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSettings } from "@/components/settings/PersonalInfoSettings";
import { PasswordSettings } from "@/components/settings/PasswordSettings";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { BackButton } from "@/components/navigation/BackButton";

const Settings = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout>
      <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[40px]">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <BackButton />
              <Link to="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  DentaFile
                </h1>
              </Link>
            </div>
            <div className="flex items-center">
              <NavMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-2 sm:px-4 lg:px-6">        
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
    </PageLayout>
  );
};

export default Settings;
