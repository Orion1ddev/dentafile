export interface PatientFormData {
  first_name: string;
  last_name: string;
  medical_history: string[];
  email?: string;
  phone?: string;
  avatar_url?: string;
}