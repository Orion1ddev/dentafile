import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const addMissingTranslation = async (key: string, en: string, tr: string) => {
  try {
    const { error } = await supabase
      .from('translations')
      .insert([
        { key, en, tr }
      ]);

    if (error) throw error;
    
    toast.success('Translation added successfully');
    return true;
  } catch (error) {
    console.error('Error adding translation:', error);
    toast.error('Failed to add translation');
    return false;
  }
};

export const findMissingTranslations = (translations: Array<{ key: string }>) => {
  // List of all translation keys used in the app
  const allKeys = [
    'dental_records',
    'born',
    'contact',
    'patient_details',
    'patient_list',
    'edit_patient',
    'add_new_patient',
    'create_patient',
    'update_patient',
    'image_uploaded',
    'upload_failed',
    'patient_created',
    'patient_updated',
    'back_to_dashboard',
    'loading',
    'manage_patients',
    'view_appointments',
    'today_schedule',
    'app_settings',
    'patient_not_found',
    // Add any other keys you notice are missing translations
  ];

  // Find keys that don't exist in the database
  const existingKeys = new Set(translations.map(t => t.key));
  return allKeys.filter(key => !existingKeys.has(key));
};

export const checkAndAddDefaultTranslations = async () => {
  try {
    // Get existing translations
    const { data: existingTranslations, error } = await supabase
      .from('translations')
      .select('key');

    if (error) throw error;

    // Find missing translations
    const missingKeys = findMissingTranslations(existingTranslations || []);

    // Default translations for missing keys
    const defaultTranslations = {
      dental_records: { en: 'Dental Records', tr: 'Diş Kayıtları' },
      born: { en: 'Born', tr: 'Doğum' },
      contact: { en: 'Contact', tr: 'İletişim' },
      patient_details: { en: 'Patient Details', tr: 'Hasta Detayları' },
      patient_list: { en: 'Patient List', tr: 'Hasta Listesi' },
      edit_patient: { en: 'Edit Patient', tr: 'Hastayı Düzenle' },
      add_new_patient: { en: 'Add New Patient', tr: 'Yeni Hasta Ekle' },
      create_patient: { en: 'Create Patient', tr: 'Hasta Oluştur' },
      update_patient: { en: 'Update Patient', tr: 'Hastayı Güncelle' },
      image_uploaded: { en: 'Image uploaded successfully', tr: 'Resim başarıyla yüklendi' },
      upload_failed: { en: 'Failed to upload image', tr: 'Resim yüklenemedi' },
      patient_created: { en: 'Patient created successfully', tr: 'Hasta başarıyla oluşturuldu' },
      patient_updated: { en: 'Patient updated successfully', tr: 'Hasta başarıyla güncellendi' },
      back_to_dashboard: { en: 'Back to Dashboard', tr: 'Panele Dön' },
      loading: { en: 'Loading...', tr: 'Yükleniyor...' },
      manage_patients: { en: 'Manage Patients', tr: 'Hastaları Yönet' },
      view_appointments: { en: 'View Appointments', tr: 'Randevuları Görüntüle' },
      today_schedule: { en: "Today's Schedule", tr: 'Bugünkü Program' },
      app_settings: { en: 'App Settings', tr: 'Uygulama Ayarları' },
      patient_not_found: { en: 'Patient not found', tr: 'Hasta bulunamadı' }
    };

    // Add missing translations
    for (const key of missingKeys) {
      if (defaultTranslations[key as keyof typeof defaultTranslations]) {
        const translation = defaultTranslations[key as keyof typeof defaultTranslations];
        await addMissingTranslation(key, translation.en, translation.tr);
      }
    }

    if (missingKeys.length > 0) {
      toast.success(`Added ${missingKeys.length} missing translations`);
    }
  } catch (error) {
    console.error('Error checking translations:', error);
    toast.error('Failed to check translations');
  }
};