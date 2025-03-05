
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

// Auth page translations hardcoded to overcome placeholder issues
const authPageTranslations: Translation[] = [
  { key: 'welcome_title', en: 'Welcome to DentaFile - Your Partner in Dental Practice Management', tr: 'DentaFile\'a Hoş Geldiniz - Dental Muayene Yönetiminde Ortağınız' },
  { key: 'patient_cards_title', en: 'Customizable Patient Cards', tr: 'Özelleştirilebilir Hasta Kartları' },
  { key: 'patient_cards_desc', en: 'Design patient profiles to suit your needs with flexible, personalized fields', tr: 'İhtiyaçlarınıza uygun esnek ve kişiselleştirilmiş hasta profilleri oluşturun' },
  { key: 'record_keeping_title', en: 'Seamless Dental Record Keeping', tr: 'Kesintisiz Randevu Kaydı Tutma' },
  { key: 'record_keeping_desc', en: 'Organize and access comprehensive patient records securely and effortlessly', tr: 'Kapsamlı hasta kayıtlarını güvenli ve zahmetsizce düzenleyin ve erişin' },
  { key: 'photo_storage_title', en: 'Secure Photo Storage', tr: 'Güvenli Fotoğraf Depolama' },
  { key: 'photo_storage_desc', en: 'Store and manage dental images with HIPAA-compliant security', tr: 'Diş görüntülerini HIPAA uyumlu güvenlikle saklayın ve yönetin' },
];

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
  { key: 'sign_out', en: 'Sign out', tr: 'Çıkış yap' },
  { key: 'language', en: 'Language', tr: 'Dil' },
  { key: 'dark_mode', en: 'Dark mode', tr: 'Karanlık mod' },
  { key: 'change_settings', en: 'Change settings', tr: 'Ayarları değiştir' },
  // Add missing translations that were showing up in console logs
  { key: 'welcome', en: 'Welcome', tr: 'Hoş geldiniz' },
  { key: 'welcome_desc', en: 'Welcome to your dental practice dashboard', tr: 'Diş hekimliği uygulaması panelinize hoş geldiniz' },
  { key: 'today_appointments', en: 'Today\'s appointments', tr: 'Bugünkü randevular' },
  { key: 'loading', en: 'Loading...', tr: 'Yükleniyor...' },
  // Calendar related translations
  { key: 'calendar_today', en: 'Today', tr: 'Bugün' },
  { key: 'calendar_month', en: 'Month', tr: 'Ay' },
  { key: 'calendar_week', en: 'Week', tr: 'Hafta' },
  { key: 'calendar_day', en: 'Day', tr: 'Gün' },
  { key: 'no_appointments', en: 'No appointments for this day', tr: 'Bu gün için randevu yok' },
  { key: 'appointments', en: 'Appointments', tr: 'Randevular' },
  { key: 'consultation', en: 'Consultation', tr: 'Konsültasyon' },
  
  // Patient Form translations
  { key: 'add_patient', en: 'Add Patient', tr: 'Hasta Ekle' },
  { key: 'edit_patient', en: 'Edit Patient', tr: 'Hastayı Düzenle' },
  { key: 'patient_created', en: 'Patient created successfully', tr: 'Hasta başarıyla oluşturuldu' },
  { key: 'patient_updated', en: 'Patient updated successfully', tr: 'Hasta başarıyla güncellendi' },
  { key: 'first_name', en: 'First Name', tr: 'Ad' },
  { key: 'last_name', en: 'Last Name', tr: 'Soyad' },
  { key: 'email', en: 'Email', tr: 'E-posta' },
  { key: 'phone', en: 'Phone', tr: 'Telefon' },
  { key: 'save_changes', en: 'Save Changes', tr: 'Değişiklikleri Kaydet' },
  
  // Dental Record Form translations
  { key: 'add_dental_record', en: 'Add Dental Record', tr: 'Diş Kaydı Ekle' },
  { key: 'edit_dental_record', en: 'Edit Dental Record', tr: 'Diş Kaydını Düzenle' },
  { key: 'add_record', en: 'Add Record', tr: 'Kayıt Ekle' },
  { key: 'record_added', en: 'Dental record added successfully', tr: 'Diş kaydı başarıyla eklendi' },
  { key: 'visit_date', en: 'Visit Date', tr: 'Ziyaret Tarihi' },
  { key: 'time', en: 'Time', tr: 'Zaman' },
  { key: 'operation_type', en: 'Operation Type', tr: 'İşlem Türü' },
  { key: 'diagnosis', en: 'Diagnosis', tr: 'Teşhis' },
  { key: 'treatment', en: 'Treatment', tr: 'Tedavi' },
  { key: 'notes', en: 'Notes', tr: 'Notlar' },
  { key: 'images', en: 'Images', tr: 'Resimler' },
  { key: 'appointment_updated', en: 'Appointment updated successfully', tr: 'Randevu başarıyla güncellendi' },
  { key: 'edit_appointment', en: 'Edit Appointment', tr: 'Randevuyu Düzenle' },
  { key: 'update_appointment', en: 'Update Appointment', tr: 'Randevuyu Güncelle' },
  { key: 'light_mode', en: 'Light mode', tr: 'Aydınlık mod' },
  { key: 'sign_out_error', en: 'Error signing out', tr: 'Çıkış yaparken hata oluştu' },
];

// Combine auth-specific translations with fallback translations
const allTranslations = [...authPageTranslations, ...fallbackTranslations];

export const useLanguage = create<LanguageState>((set, get) => ({
  language: localStorage.getItem("language") || "en",
  translations: allTranslations, // Use combined translations as initial state
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
        console.error('Error fetching translations:', error);
        // Fallback to combined translations if fetch fails
        set({ translations: allTranslations });
        return;
      }

      if (data && data.length > 0) {
        // Create a map of all existing translations for quick lookups
        const existingTranslationsMap = allTranslations.reduce((map, t) => {
          map[t.key] = true;
          return map;
        }, {} as Record<string, boolean>);
        
        // Start with our predefined translations
        const mergedTranslations = [...allTranslations];
        
        // Add any unique translations from the database that aren't in our predefined list
        data.forEach(dbTranslation => {
          // Skip if it's an auth page translation we already have hardcoded
          const isAuthTranslation = authPageTranslations.some(t => t.key === dbTranslation.key);
          
          if (!existingTranslationsMap[dbTranslation.key] && !isAuthTranslation) {
            mergedTranslations.push(dbTranslation);
            existingTranslationsMap[dbTranslation.key] = true;
          }
        });
        
        set({ translations: mergedTranslations });
      } else {
        // If no translations found in database, use combined translations
        set({ translations: allTranslations });
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
      // Fallback to combined translations if fetch fails
      set({ translations: allTranslations });
    }
  },
}));
