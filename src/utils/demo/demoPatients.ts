
import { format, subDays } from "date-fns";
import { DEMO_USER_ID } from "./demoConfig";

// Generate a date in the past (for creating realistic historical data)
const getPastDate = (daysAgo: number): string => {
  return format(subDays(new Date(), daysAgo), "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

// Sample patient data
export const samplePatients = [
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
    created_at: getPastDate(30),
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
    created_at: getPastDate(25),
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
    created_at: getPastDate(20),
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
    created_at: getPastDate(15),
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
    created_at: getPastDate(10),
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
    created_at: getPastDate(5),
  },
];

// Function to get patients data for demo mode
export const getDemoPatients = () => {
  return samplePatients;
};
