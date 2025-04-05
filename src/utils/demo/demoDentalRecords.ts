import { format, subDays, addDays } from "date-fns";
import { getDemoPatients } from "./demoPatients";

// Generate a date in the past (for creating realistic historical data)
const getPastDate = (daysAgo: number): string => {
  return format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

// Generate a date in the future (for upcoming appointments)
const getFutureDate = (daysAhead: number): string => {
  return format(addDays(new Date(), daysAhead), "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

// Sample dental records
export const sampleDentalRecords = [
  // Past records (completed treatments)
  {
    id: "20000000-0000-0000-0000-000000000001",
    patient_id: "10000000-0000-0000-0000-000000000001",
    visit_date: getPastDate(28),
    diagnosis: "Moderate dental caries on tooth #19",
    treatment: "Composite filling on tooth #19",
    notes: "Patient reported sensitivity to cold. Recommended sensodyne toothpaste.",
    operation_type: "Restorative"
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    patient_id: "10000000-0000-0000-0000-000000000001",
    visit_date: getPastDate(14),
    diagnosis: "Follow-up examination",
    treatment: "Prophylaxis and fluoride treatment",
    notes: "No sensitivity reported. Good healing of previous restoration.",
    operation_type: "Preventive"
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    patient_id: "10000000-0000-0000-0000-000000000002",
    visit_date: getPastDate(22),
    diagnosis: "Mild gingivitis, moderate calculus buildup",
    treatment: "Scaling and root planing, upper and lower quadrants",
    notes: "Patient advised on improved brushing technique and flossing daily.",
    operation_type: "Periodontal"
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    patient_id: "10000000-0000-0000-0000-000000000003",
    visit_date: getPastDate(18),
    diagnosis: "Initial examination, no significant findings",
    treatment: "Full mouth x-rays, prophylaxis",
    notes: "Patient is due for wisdom teeth evaluation in 6 months.",
    operation_type: "Diagnostic"
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    patient_id: "10000000-0000-0000-0000-000000000004",
    visit_date: getPastDate(12),
    diagnosis: "Fractured crown on tooth #30",
    treatment: "Crown replacement, PFM",
    notes: "Temporary crown placed. Patient to return in 2 weeks for permanent crown.",
    operation_type: "Prosthodontic"
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    patient_id: "10000000-0000-0000-0000-000000000004",
    visit_date: getPastDate(5),
    diagnosis: "Follow-up for crown placement",
    treatment: "Permanent crown cementation",
    notes: "Patient satisfied with fit and appearance.",
    operation_type: "Prosthodontic"
  },
  {
    id: "20000000-0000-0000-0000-000000000007",
    patient_id: "10000000-0000-0000-0000-000000000005",
    visit_date: getPastDate(8),
    diagnosis: "Moderate dental anxiety, initial examination",
    treatment: "Examination, treatment plan discussion",
    notes: "Patient interested in teeth whitening options. Provided information on in-office and take-home treatments.",
    operation_type: "Consultation"
  },
  
  // Future appointments
  {
    id: "20000000-0000-0000-0000-000000000008",
    patient_id: "10000000-0000-0000-0000-000000000001",
    visit_date: getFutureDate(2),
    appointment_time: "10:00",
    diagnosis: null,
    treatment: null,
    notes: "Regular check-up and cleaning",
    operation_type: "Preventive"
  },
  {
    id: "20000000-0000-0000-0000-000000000009",
    patient_id: "10000000-0000-0000-0000-000000000003",
    visit_date: getFutureDate(3),
    appointment_time: "14:30",
    diagnosis: null,
    treatment: null,
    notes: "Wisdom teeth evaluation",
    operation_type: "Consultation"
  },
  {
    id: "20000000-0000-0000-0000-000000000010",
    patient_id: "10000000-0000-0000-0000-000000000005",
    visit_date: getFutureDate(5),
    appointment_time: "11:15",
    diagnosis: null,
    treatment: null,
    notes: "In-office teeth whitening procedure",
    operation_type: "Cosmetic"
  }
];

// Function to get dental records for a specific patient in demo mode
export const getDemoDentalRecords = (patientId: string) => {
  return sampleDentalRecords.filter(record => record.patient_id === patientId);
};

// Function to get all dental records
export const getAllDemoDentalRecords = () => {
  return sampleDentalRecords;
};

// Function to get upcoming appointments with full patient data
export const getDemoAppointments = (date?: Date) => {
  const patients = getDemoPatients();
  
  // Helper function to enhance record with patient data
  const enhanceRecordWithPatient = (record: any) => {
    const patient = patients.find(p => p.id === record.patient_id);
    if (!patient) return null;
    
    return {
      ...record,
      patient: {
        ...patient,
        avatar_url: patient.avatar_url || null,
        medical_history: patient.medical_history || null,
        pinned: patient.pinned || false
      }
    };
  };
  
  // If date is provided, return appointments for that specific date
  if (date) {
    const dateString = format(date, 'yyyy-MM-dd');
    return sampleDentalRecords
      .filter(record => record.appointment_time && record.visit_date.startsWith(dateString))
      .map(enhanceRecordWithPatient)
      .filter(Boolean);
  }
  
  // Otherwise return all appointments (records with appointment_time)
  return sampleDentalRecords
    .filter(record => record.appointment_time)
    .map(enhanceRecordWithPatient)
    .filter(Boolean);
};
