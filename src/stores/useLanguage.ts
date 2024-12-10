import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

type Translation = {
  key: string;
  en: string;
  tr: string;
};

type LanguageStore = {
  language: 'en' | 'tr';
  translations: Translation[];
  setLanguage: (lang: 'en' | 'tr') => void;
  t: (key: string) => string;
  fetchTranslations: () => Promise<void>;
};

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: 'en',
      translations: [],
      setLanguage: (lang) => set({ language: lang }),
      t: (key) => {
        const translation = get().translations.find((t) => t.key === key);
        return translation ? translation[get().language] : key;
      },
      fetchTranslations: async () => {
        const { data } = await supabase
          .from('translations')
          .select('*');
        if (data) {
          set({ translations: data });
        }
      },
    }),
    {
      name: 'language-store',
    }
  )
);