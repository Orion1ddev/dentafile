import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

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

export const useLanguage = create<LanguageState>((set, get) => ({
  language: localStorage.getItem("language") || "en",
  translations: [],
  setLanguage: (language: string) => {
    localStorage.setItem("language", language);
    set({ language });
  },
  t: (key: string) => {
    const { language, translations } = get();
    const translation = translations.find(t => t.key === key);
    if (!translation) return key;
    return translation[language as "en" | "tr"] || key;
  },
  fetchTranslations: async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*');

      if (error) {
        console.error('Error fetching translations:', error);
        return;
      }

      set({ translations: data });
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  }
}));