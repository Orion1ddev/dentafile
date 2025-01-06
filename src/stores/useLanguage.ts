import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface Translation {
  key: string;
  en: string;
  tr: string;
}

interface LanguageState {
  language: string;
  translations: Translation[];
  setLanguage: (language: string) => void;
  t: (key: string) => string;
  fetchTranslations: () => Promise<void>;
}

const fallbackTranslations: Translation[] = [
  { key: 'good_morning', en: 'Good morning', tr: 'Günaydın' },
  { key: 'good_afternoon', en: 'Good afternoon', tr: 'İyi öğleden sonra' },
  { key: 'good_evening', en: 'Good evening', tr: 'İyi akşamlar' },
  { key: 'you_have', en: 'You have', tr: 'Sizde var' },
  { key: 'appointments_today', en: 'appointments today', tr: 'randevular bugün' },
  { key: 'no_appointments_today', en: 'No appointments today', tr: 'Bugün randevu yok' },
  { key: 'pinned_patients', en: 'pinned patients', tr: 'sabitlemiş hastalar' },
  { key: 'settings', en: 'Settings', tr: 'Ayarlar' },
  { key: 'settings_desc', en: 'Manage your settings', tr: 'Ayarlarınızı yönetin' },
  { key: 'calendar', en: 'Calendar', tr: 'Takvim' },
  { key: 'manage_calendar', en: 'Manage your calendar', tr: 'Takviminizi yönetin' },
  { key: 'view_calendar', en: 'View calendar', tr: 'Takvimi görüntüle' },
  { key: 'patient_records', en: 'Patient Records', tr: 'Hasta Kayıtları' },
  { key: 'manage_patients', en: 'Manage your patients', tr: 'Hastalarınızı yönetin' },
  { key: 'view_records', en: 'View records', tr: 'Kayıtları görüntüle' },
];

export const useLanguage = create<LanguageState>((set, get) => ({
  language: localStorage.getItem("language") || "en",
  translations: fallbackTranslations,
  setLanguage: (language: string) => {
    localStorage.setItem("language", language);
    set({ language });
  },
  t: (key: string) => {
    const state = get();
    const translation = state.translations.find((t) => t.key === key);
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    return translation[state.language as keyof typeof translation] || key;
  },
  fetchTranslations: async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        set({ translations: data });
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      // Fallback to default translations if fetch fails
      set({ translations: fallbackTranslations });
    }
  },
}));
