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
  { key: 'welcome_title', en: 'Welcome to DentaFile', tr: 'DentaFile\'a Hoşgeldiniz' },
  { key: 'patient_cards_title', en: 'Patient Cards', tr: 'Hasta Kartları' },
  { key: 'patient_cards_desc', en: 'Manage your patient records efficiently', tr: 'Hasta kayıtlarınızı verimli bir şekilde yönetin' },
  { key: 'record_keeping_title', en: 'Record Keeping', tr: 'Kayıt Tutma' },
  { key: 'record_keeping_desc', en: 'Keep track of patient history and treatments', tr: 'Hasta geçmişi ve tedavileri takip edin' },
  { key: 'photo_storage_title', en: 'Photo Storage', tr: 'Fotoğraf Depolama' },
  { key: 'photo_storage_desc', en: 'Store and manage patient photos securely', tr: 'Hasta fotoğraflarını güvenli bir şekilde saklayın ve yönetin' },
  { key: 'settings', en: 'Settings', tr: 'Ayarlar' },
  { key: 'light_mode', en: 'Light Mode', tr: 'Aydınlık Mod' },
  { key: 'dark_mode', en: 'Dark Mode', tr: 'Karanlık Mod' },
  { key: 'language', en: 'Language', tr: 'Dil' },
  { key: 'sign_out', en: 'Sign Out', tr: 'Çıkış Yap' },
  { key: 'export_data', en: 'Export Data', tr: 'Verileri Dışa Aktar' },
  { key: 'export_success', en: 'Data exported successfully', tr: 'Veriler başarıyla dışa aktarıldı' },
  { key: 'export_error', en: 'Failed to export data', tr: 'Veriler dışa aktarılamadı' },
  { key: 'sign_out_error', en: 'Error signing out', tr: 'Çıkış yapılırken hata oluştu' },
  { key: 'consultation', en: 'Consultation', tr: 'Konsültasyon' },
  { key: 'today_appointments', en: 'Today\'s Appointments', tr: 'Bugünkü Randevular' },
  { key: 'dashboard', en: 'Dashboard', tr: 'Panel' },
  { key: 'app_settings', en: 'App Settings', tr: 'Uygulama Ayarları' },
  { key: 'today_schedule', en: 'Today\'s Schedule', tr: 'Bugünkü Program' },
  { key: 'view_appointments', en: 'View Appointments', tr: 'Randevuları Görüntüle' },
  { key: 'calendar', en: 'Calendar', tr: 'Takvim' }
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