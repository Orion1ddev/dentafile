
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Mock User ID for demo purposes - will be used as the user_id for all created records
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000000";

// Sample patient data
const samplePatients = [
  {
    id: "10000000-0000-0000-0000-000000000001",
    first_name: "Emily",
    last_name: "Johnson",
    gender: "female",
    date_of_birth: "1985-05-15",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 123-4567",
    medical_history: ["Asthma", "Allergies: Penicillin"],
    user_id: DEMO_USER_ID,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    first_name: "Michael",
    last_name: "Smith",
    gender: "male",
    date_of_birth: "1978-11-23",
    email: "michael.smith@example.com",
    phone: "+1 (555) 987-6543",
    medical_history: ["Hypertension", "Type 2 Diabetes"],
    user_id: DEMO_USER_ID,
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
  },
  {
    id: "10000000-0000-0000-0000-000000000003",
    first_name: "Sophia",
    last_name: "Garcia",
    gender: "female",
    date_of_birth: "1992-08-10",
    email: "sophia.garcia@example.com",
    phone: "+1 (555) 456-7890",
    medical_history: [],
    user_id: DEMO_USER_ID,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
  },
  {
    id: "10000000-0000-0000-0000-000000000004",
    first_name: "James",
    last_name: "Wilson",
    gender: "male",
    date_of_birth: "1965-03-17",
    email: "james.wilson@example.com",
    phone: "+1 (555) 789-0123",
    medical_history: ["Heart Disease", "Arthritis"],
    user_id: DEMO_USER_ID,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: "10000000-0000-0000-0000-000000000005",
    first_name: "Olivia",
    last_name: "Martinez",
    gender: "female",
    date_of_birth: "2001-01-30",
    email: "olivia.martinez@example.com",
    phone: "+1 (555) 234-5678",
    medical_history: ["Anxiety"],
    user_id: DEMO_USER_ID,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: "10000000-0000-0000-0000-000000000006",
    first_name: "Alexander",
    last_name: "Brown",
    gender: "male",
    date_of_birth: "1995-09-12",
    email: "alexander.brown@example.com",
    phone: "+1 (555) 876-5432",
    medical_history: [],
    user_id: DEMO_USER_ID,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
];

// Sample dental records
const sampleDentalRecords = [
  {
    id: "20000000-0000-0000-0000-000000000001",
    patient_id: "10000000-0000-0000-0000-000000000001",
    visit_date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
    diagnosis: "Moderate dental caries on tooth #19",
    treatment: "Composite filling on tooth #19",
    notes: "Patient reported sensitivity to cold. Recommended sensodyne toothpaste.",
    operation_type: "Restorative"
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    patient_id: "10000000-0000-0000-0000-000000000001",
    visit_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    diagnosis: "Follow-up examination",
    treatment: "Prophylaxis and fluoride treatment",
    notes: "No sensitivity reported. Good healing of previous restoration.",
    operation_type: "Preventive"
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    patient_id: "10000000-0000-0000-0000-000000000002",
    visit_date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days ago
    diagnosis: "Mild gingivitis, moderate calculus buildup",
    treatment: "Scaling and root planing, upper and lower quadrants",
    notes: "Patient advised on improved brushing technique and flossing daily.",
    operation_type: "Periodontal"
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    patient_id: "10000000-0000-0000-0000-000000000003",
    visit_date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
    diagnosis: "Initial examination, no significant findings",
    treatment: "Full mouth x-rays, prophylaxis",
    notes: "Patient is due for wisdom teeth evaluation in 6 months.",
    operation_type: "Diagnostic"
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    patient_id: "10000000-0000-0000-0000-000000000004",
    visit_date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    diagnosis: "Fractured crown on tooth #30",
    treatment: "Crown replacement, PFM",
    notes: "Temporary crown placed. Patient to return in 2 weeks for permanent crown.",
    operation_type: "Prosthodontic"
  },
  {
    id: "20000000-0000-0000-0000-000000000006",
    patient_id: "10000000-0000-0000-0000-000000000004",
    visit_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    diagnosis: "Follow-up for crown placement",
    treatment: "Permanent crown cementation",
    notes: "Patient satisfied with fit and appearance.",
    operation_type: "Prosthodontic"
  },
  {
    id: "20000000-0000-0000-0000-000000000007",
    patient_id: "10000000-0000-0000-0000-000000000005",
    visit_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
    diagnosis: "Moderate dental anxiety, initial examination",
    treatment: "Examination, treatment plan discussion",
    notes: "Patient interested in teeth whitening options. Provided information on in-office and take-home treatments.",
    operation_type: "Consultation"
  },
];

// Function to intercept Supabase calls and return mock data in demo mode
export const setupDemoInterceptor = () => {
  const originalFrom = supabase.from;
  
  // Monkey patch the from method to intercept calls
  (supabase as any).from = function(table: string) {
    const isDemoMode = localStorage.getItem('demoMode') === 'true';
    
    if (!isDemoMode) {
      return originalFrom.call(this, table);
    }
    
    // Return a modified query builder that will return mock data
    const mockQueryBuilder = {
      select: () => mockQueryBuilder,
      eq: () => mockQueryBuilder,
      order: () => mockQueryBuilder,
      limit: () => mockQueryBuilder,
      single: () => mockQueryBuilder,
      or: () => mockQueryBuilder,
      then: (callback: Function) => {
        let mockData;
        
        if (table === 'patients') {
          mockData = { data: samplePatients, error: null };
        } else if (table === 'dental_records') {
          mockData = { data: sampleDentalRecords, error: null };
        } else {
          mockData = { data: [], error: null };
        }
        
        return Promise.resolve(mockData).then(callback);
      }
    };
    
    return mockQueryBuilder;
  };
};

// Initialize the demo data
export const initDemoData = async () => {
  try {
    console.log('Initializing demo data...');
    
    // Setup mock interceptor
    setupDemoInterceptor();
    
    // Mock the authentication
    localStorage.setItem('demoUserId', DEMO_USER_ID);
    
    // Show a welcome toast
    toast.success("Welcome to the demo version! Browse through sample patient data.");
    
    return true;
  } catch (error) {
    console.error('Error initializing demo data:', error);
    toast.error("Error setting up demo data. Please try again.");
    return false;
  }
};

// Helper function to get current demo user
export const getDemoUser = () => {
  return {
    id: DEMO_USER_ID,
    email: "demo@dentafile.com",
    user_metadata: {
      first_name: "Demo",
      last_name: "User"
    }
  };
};

// Override the usePatients hook
export const getDemoPatients = () => {
  return samplePatients;
};

// Override the dental records
export const getDemoDentalRecords = (patientId: string) => {
  return sampleDentalRecords.filter(record => record.patient_id === patientId);
};
