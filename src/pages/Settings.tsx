import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoSettings } from "@/components/settings/PersonalInfoSettings";
import { PasswordSettings } from "@/components/settings/PasswordSettings";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import { useLanguage } from "@/stores/useLanguage";
import { NavMenu } from "@/components/NavMenu";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-background/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-muted-foreground hover:text-foreground"
                aria-label={t('back_to_dashboard')}
              >
                <Link to="/">
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <Link to="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  DentaFile
                </h1>
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
        <NavMenu />
      </div>
    </div>
  );
};

export default Settings;