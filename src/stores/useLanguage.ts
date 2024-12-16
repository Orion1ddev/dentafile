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

// Fallback translations for critical UI elements
const fallbackTranslations: Translation[] = [
  { key: 'login_title', en: 'Welcome Back', tr: 'Tekrar Hoşgeldiniz' },
  { key: 'email', en: 'Email', tr: 'E-posta' },
  { key: 'password', en: 'Password', tr: 'Şifre' },
  { key: 'login', en: 'Login', tr: 'Giriş Yap' },
  { key: 'logging_in', en: 'Logging in...', tr: 'Giriş yapılıyor...' },
  { key: 'create_account', en: 'Create Account', tr: 'Hesap Oluştur' },
  { key: 'login_success', en: 'Successfully logged in', tr: 'Başarıyla giriş yapıldı' },
  { key: 'login_error', en: 'Login failed', tr: 'Giriş başarısız' },
  { key: 'loading', en: 'Loading...', tr: 'Yükleniyor...' },
];

export const useLanguage = create<LanguageState>((set, get) => ({
  language: localStorage.getItem("language") || "en",
  translations: fallbackTranslations,
  setLanguage: (language: string) => {
    localStorage.setItem("language", language);
    set({ language });
  },
  t: (key: string) => {
    const { language, translations } = get();
    const translation = translations.find(t => t.key === key) || 
                       fallbackTranslations.find(t => t.key === key);
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
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

      // Merge fetched translations with fallback translations
      const mergedTranslations = [...fallbackTranslations];
      data.forEach(translation => {
        const existingIndex = mergedTranslations.findIndex(t => t.key === translation.key);
        if (existingIndex >= 0) {
          mergedTranslations[existingIndex] = translation;
        } else {
          mergedTranslations.push(translation);
        }
      });

      set({ translations: mergedTranslations });
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  }
}));