
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Menu, Calendar, Users, Settings, Heart, X } from "lucide-react";
import { useLanguage } from "@/stores/useLanguage";
import { useNavigate } from "react-router-dom";

interface QuickAccessDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickAccessDrawer({ open, onOpenChange }: QuickAccessDrawerProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const navigationItems = [
    {
      name: t('patient_records'),
      icon: <Users className="h-5 w-5" />,
      href: '/patients',
      description: t('manage_patients')
    },
    {
      name: t('calendar'),
      icon: <Calendar className="h-5 w-5" />,
      href: '/calendar',
      description: t('manage_calendar')
    },
    {
      name: t('settings'),
      icon: <Settings className="h-5 w-5" />,
      href: '/settings',
      description: t('settings_desc')
    },
    {
      name: t('support_us'),
      icon: <Heart className="h-5 w-5" />,
      href: 'https://buymeacoffee.com/dentafile',
      description: t('support_description')
    }
  ];

  const handleNavigation = (href: string) => {
    onOpenChange(false);
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    } else {
      navigate(href);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-accent/50 rounded-full"
          aria-label={t('open_menu')}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="px-4 pb-6">
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        <div className="flex justify-between items-center mt-2 mb-6 px-2">
          <h3 className="text-lg font-medium">{t('quick_access')}</h3>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">{t('close')}</span>
            </Button>
          </DrawerClose>
        </div>
        <div className="grid gap-3 px-2">
          {navigationItems.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              className="flex justify-start gap-4 p-6 h-auto"
              onClick={() => handleNavigation(item.href)}
            >
              <div className="flex-shrink-0 p-1">
                {item.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
