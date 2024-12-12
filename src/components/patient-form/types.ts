export interface PatientFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  medical_history: string[];
  email?: string;
  phone?: string;
}