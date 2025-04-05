
import { supabase } from "@/integrations/supabase/client";
import { isDemoMode } from "./demoConfig";
import { getDemoPatients, samplePatients } from "./demoPatients";
import { getAllDemoDentalRecords, getDemoDentalRecords, getDemoAppointments } from "./demoDentalRecords";

type MockQueryResult<T> = {
  data: T | null;
  error: Error | null;
};

// Function to intercept Supabase calls and return mock data in demo mode
export const setupDemoInterceptor = () => {
  // Store original supabase.from method to restore later if needed
  (supabase as any)._originalFrom = supabase.from;
  
  // Monkey patch the from method to intercept calls
  (supabase as any).from = function(table: string) {
    if (!isDemoMode()) {
      return (supabase as any)._originalFrom.call(this, table);
    }
    
    // Create a mock query builder for demo mode
    const mockQueryBuilder = {
      select: () => mockQueryBuilder,
      insert: () => mockQueryBuilder,
      update: () => mockQueryBuilder,
      delete: () => mockQueryBuilder,
      eq: () => mockQueryBuilder,
      neq: () => mockQueryBuilder,
      gt: () => mockQueryBuilder,
      gte: () => mockQueryBuilder,
      lt: () => mockQueryBuilder,
      lte: () => mockQueryBuilder,
      like: () => mockQueryBuilder,
      ilike: () => mockQueryBuilder,
      is: () => mockQueryBuilder,
      in: () => mockQueryBuilder,
      contains: () => mockQueryBuilder,
      containedBy: () => mockQueryBuilder,
      rangeLt: () => mockQueryBuilder,
      rangeGt: () => mockQueryBuilder,
      rangeGte: () => mockQueryBuilder,
      rangeLte: () => mockQueryBuilder,
      overlaps: () => mockQueryBuilder,
      textSearch: () => mockQueryBuilder,
      not: () => mockQueryBuilder,
      filter: () => mockQueryBuilder,
      or: () => mockQueryBuilder,
      and: () => mockQueryBuilder,
      order: () => mockQueryBuilder,
      limit: () => mockQueryBuilder,
      range: () => mockQueryBuilder,
      single: () => mockQueryBuilder,
      maybeSingle: () => mockQueryBuilder,
      csv: () => mockQueryBuilder,
      then: (callback: (value: any) => any) => {
        let mockData: MockQueryResult<any>;
        
        if (table === 'patients') {
          mockData = { data: getDemoPatients(), error: null };
        } 
        else if (table === 'dental_records') {
          // For dental records, we need to handle different query patterns
          mockData = { data: getAllDemoDentalRecords(), error: null };
        }
        else {
          mockData = { data: [], error: null };
        }
        
        return Promise.resolve(mockData).then(callback);
      }
    };
    
    return mockQueryBuilder;
  };
  
  // Also mock auth methods
  const originalGetUser = supabase.auth.getUser;
  (supabase.auth as any)._originalGetUser = originalGetUser;
  
  supabase.auth.getUser = async () => {
    if (isDemoMode()) {
      return {
        data: {
          user: {
            id: "00000000-0000-0000-0000-000000000000",
            email: "demo@dentafile.com",
            user_metadata: {
              first_name: "Demo",
              last_name: "User"
            }
          }
        },
        error: null
      };
    }
    return originalGetUser.call(supabase.auth);
  };
  
  // Mock getSession for demo mode
  const originalGetSession = supabase.auth.getSession;
  (supabase.auth as any)._originalGetSession = originalGetSession;
  
  supabase.auth.getSession = async () => {
    if (isDemoMode()) {
      return {
        data: {
          session: {
            access_token: "demo_access_token",
            refresh_token: "demo_refresh_token",
            user: {
              id: "00000000-0000-0000-0000-000000000000",
              email: "demo@dentafile.com",
              user_metadata: {
                first_name: "Demo",
                last_name: "User"
              }
            }
          }
        },
        error: null
      };
    }
    return originalGetSession.call(supabase.auth);
  };
};

// Function to restore original Supabase methods
export const restoreSupabaseMethods = () => {
  // Restore original from method if it exists
  if ((supabase as any)._originalFrom) {
    supabase.from = (supabase as any)._originalFrom;
    delete (supabase as any)._originalFrom;
  }
  
  // Restore original auth methods if they exist
  if ((supabase.auth as any)._originalGetUser) {
    supabase.auth.getUser = (supabase.auth as any)._originalGetUser;
    delete (supabase.auth as any)._originalGetUser;
  }
  
  if ((supabase.auth as any)._originalGetSession) {
    supabase.auth.getSession = (supabase.auth as any)._originalGetSession;
    delete (supabase.auth as any)._originalGetSession;
  }
};
