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
  // Auth related translations
  { key: 'login_title', en: 'Welcome Back', tr: 'Tekrar Hoşgeldiniz' },
  { key: 'sign_up_title', en: 'Create Account', tr: 'Hesap Oluştur' },
  { key: 'additional_info', en: 'Additional Information', tr: 'Ek Bilgiler' },
  { key: 'email', en: 'Email', tr: 'E-posta' },
  { key: 'password', en: 'Password', tr: 'Şifre' },
  { key: 'first_name', en: 'First Name', tr: 'Ad' },
  { key: 'last_name', en: 'Last Name', tr: 'Soyad' },
  { key: 'continue', en: 'Continue', tr: 'Devam Et' },
  { key: 'back', en: 'Back', tr: 'Geri' },
  { key: 'complete_signup', en: 'Complete Sign Up', tr: 'Kaydı Tamamla' },
  { key: 'back_to_login', en: 'Back to Login', tr: 'Girişe Dön' },
  { key: 'login', en: 'Login', tr: 'Giriş Yap' },
  { key: 'create_account', en: 'Create Account', tr: 'Hesap Oluştur' },
  { key: 'logging_in', en: 'Logging in...', tr: 'Giriş yapılıyor...' },
  { key: 'signing_up', en: 'Signing up...', tr: 'Kayıt yapılıyor...' },
  { key: 'loading', en: 'Loading...', tr: 'Yükleniyor...' },
  { key: 'all_fields_required', en: 'All fields are required', tr: 'Tüm alanlar zorunludur' },
  { key: 'check_email_verification', en: 'Please check your email for verification', tr: 'Lütfen e-postanızı doğrulama için kontrol edin' },
  { key: 'signup_error', en: 'Error during signup', tr: 'Kayıt sırasında hata oluştu' },
  { key: 'login_error', en: 'Login failed', tr: 'Giriş başarısız' },
  { key: 'login_success', en: 'Successfully logged in', tr: 'Başarıyla giriş yapıldı' },

  // Welcome section translations
  { key: 'welcome_title', en: 'Welcome to DentaFile - Your Digital Dental Practice Assistant', tr: 'DentaFile\'a Hoşgeldiniz - Dijital Diş Hekimliği Asistanınız' },
  { key: 'patient_cards_title', en: 'Smart Patient Management', tr: 'Akıllı Hasta Yönetimi' },
  { key: 'patient_cards_desc', en: 'Efficiently organize and access patient information with our intuitive card system', tr: 'Sezgisel kart sistemimizle hasta bilgilerini verimli bir şekilde düzenleyin ve erişin' },
  { key: 'record_keeping_title', en: 'Digital Record Keeping', tr: 'Dijital Kayıt Tutma' },
  { key: 'record_keeping_desc', en: 'Keep detailed digital records of treatments, appointments, and patient history', tr: 'Tedavilerin, randevuların ve hasta geçmişinin detaylı dijital kayıtlarını tutun' },
  { key: 'photo_storage_title', en: 'Secure Image Storage', tr: 'Güvenli Görüntü Depolama' },
  { key: 'photo_storage_desc', en: 'Store and manage dental images securely in the cloud', tr: 'Diş görüntülerini bulutta güvenli bir şekilde saklayın ve yönetin' },

  // Other translations
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
  { key: 'today_schedule', en: 'Today\'s Schedule', tr: 'Bugünkü Program' },
  { key: 'view_appointments', en: 'View Appointments', tr: 'Randevuları Görüntüle' },
  { key: 'calendar', en: 'Calendar', tr: 'Takvim' },
  { key: 'user_not_authenticated', en: 'User not authenticated', tr: 'Kullanıcı kimliği doğrulanmadı' },
  { key: 'failed_load_profile', en: 'Failed to load profile', tr: 'Profil yüklenemedi' },
  { key: 'failed_create_profile', en: 'Failed to create profile', tr: 'Profil oluşturulamadı' },
  { key: 'profile_updated', en: 'Profile updated successfully', tr: 'Profil başarıyla güncellendi' },
  { key: 'profile_update_error', en: 'Failed to update profile', tr: 'Profil güncellenemedi' },
  { key: 'enter_first_name', en: 'Enter your first name', tr: 'Adınızı girin' },
  { key: 'enter_last_name', en: 'Enter your last name', tr: 'Soyadınızı girin' },
  { key: 'select_gender', en: 'Select your gender', tr: 'Cinsiyetinizi seçin' },
  { key: 'saving', en: 'Saving...', tr: 'Kaydediliyor...' },
  { key: 'save_changes', en: 'Save Changes', tr: 'Değişiklikleri Kaydet' },
  { key: 'good_morning', en: 'Good morning', tr: 'Günaydın' },
  { key: 'good_afternoon', en: 'Good afternoon', tr: 'İyi günler' },
  { key: 'good_evening', en: 'Good evening', tr: 'İyi akşamlar' },
  { key: 'dr_mr', en: 'Dr. Mr.', tr: 'Dr. Bay' },
  { key: 'dr_mrs', en: 'Dr. Mrs.', tr: 'Dr. Bayan' },
  { key: 'you_have', en: 'You have', tr: 'Sizin' },
  { key: 'appointments_today', en: 'appointments today', tr: 'randevunuz var bugün' },
  { key: 'no_appointments_today', en: 'You have no appointments today', tr: 'Bugün randevunuz yok' },
  { key: 'pinned_patients', en: 'pinned patients', tr: 'önemli hasta' },
  { key: 'personal_info', en: 'Personal Information', tr: 'Kişisel Bilgiler' },
  { key: 'current_password', en: 'Current Password', tr: 'Mevcut Şifre' },
  { key: 'new_password', en: 'New Password', tr: 'Yeni Şifre' },
  { key: 'confirm_password', en: 'Confirm Password', tr: 'Şifreyi Onayla' },
  { key: 'update_password', en: 'Update Password', tr: 'Şifreyi Güncelle' },
  { key: 'updating', en: 'Updating...', tr: 'Güncelleniyor...' },
  { key: 'passwords_dont_match', en: 'Passwords do not match', tr: 'Şifreler eşleşmiyor' },
  { key: 'current_password_incorrect', en: 'Current password is incorrect', tr: 'Mevcut şifre yanlış' },
  { key: 'password_updated', en: 'Password updated successfully', tr: 'Şifre başarıyla güncellendi' },
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
    const translation = translations.find(t => t.key === key);
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    return translation[language as keyof Pick<Translation, "en" | "tr">] || key;
  },
  fetchTranslations: async () => {
    try {
      const { data, error } = await supabase
        .from('translations')
        .select('*')
        .order('key', { ascending: true });

      if (error) {
        console.error('Error fetching translations:', error);
        return;
      }

      if (data) {
        // Merge database translations with fallback translations
        const mergedTranslations = [...fallbackTranslations];
        
        data.forEach(dbTranslation => {
          const existingIndex = mergedTranslations.findIndex(t => t.key === dbTranslation.key);
          if (existingIndex >= 0) {
            mergedTranslations[existingIndex] = dbTranslation;
          } else {
            mergedTranslations.push(dbTranslation);
          }
        });

        set({ translations: mergedTranslations });
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    }
  }
}));
