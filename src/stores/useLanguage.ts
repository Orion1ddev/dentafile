import { create } from "zustand";

interface LanguageState {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string) => string;
}

const translations = {
  patients: {
    en: "Patients",
    tr: "Hastalar"
  },
  add_patient: {
    en: "Add Patient",
    tr: "Hasta Ekle"
  },
  search: {
    en: "Search",
    tr: "Ara"
  },
  loading: {
    en: "Loading...",
    tr: "Yükleniyor..."
  },
  back_to_dashboard: {
    en: "Back to Dashboard",
    tr: "Gösterge Paneline Dön"
  },
  born: {
    en: "born",
    tr: "doğum"
  },
  contact: {
    en: "contact",
    tr: "iletişim"
  },
  appointments_for: {
    en: "Appointments for",
    tr: "Randevular"
  },
  no_appointments: {
    en: "No appointments scheduled for this date",
    tr: "Bu tarih için randevu bulunmamaktadır"
  }
};

export const useLanguage = create<LanguageState>((set, get) => ({
  language: localStorage.getItem("language") || "en",
  setLanguage: (language: string) => {
    localStorage.setItem("language", language);
    set({ language });
  },
  t: (key: string) => {
    const language = get().language;
    return translations[key as keyof typeof translations]?.[language as "en" | "tr"] || key;
  },
}));