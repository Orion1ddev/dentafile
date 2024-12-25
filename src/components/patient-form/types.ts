export interface PatientFormData {
  first_name: string;
  last_name: string;
  medical_history: string[];
  email?: string;
  phone?: string;
  avatar_url?: string;
}

export interface PatientFormDialogProps {
  mode?: "create" | "edit";
  patientId?: string;
  defaultValues?: PatientFormData;
  onSubmitSuccess?: () => void;
  trigger?: React.ReactNode;
}