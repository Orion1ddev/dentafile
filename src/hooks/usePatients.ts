
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { getCachedOrFetch } from "@/utils/apiCache";
import { getDemoPatients, DEMO_USER_ID } from "@/utils/demoData";

export const usePatients = (searchQuery: string) => {
  const isDemoMode = localStorage.getItem('demoMode') === 'true';

  const fetchPatients = useCallback(async () => {
    try {
      console.log('Fetching patients data, search query:', searchQuery);
      
      // If in demo mode, return demo patients
      if (isDemoMode) {
        console.log('Using demo patients data');
        let patients = getDemoPatients();
        
        // Filter by search query if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          patients = patients.filter(patient => 
            patient.first_name.toLowerCase().includes(query) || 
            patient.last_name.toLowerCase().includes(query)
          );
        }
        
        console.log(`Successfully fetched ${patients.length} demo patients`);
        return patients;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found when fetching patients');
        throw new Error("Not authenticated");
      }
      
      console.log('User authenticated, user ID:', user.id);
      let query = supabase.from('patients')
        .select('*, dental_records(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} patients`);
      return data;
    } catch (error) {
      console.error('Error in patients query:', error);
      throw error;
    }
  }, [searchQuery, isDemoMode]);

  const getCacheKey = useCallback(() => {
    return `patients_${searchQuery || 'all'}_${isDemoMode ? 'demo' : 'real'}`;
  }, [searchQuery, isDemoMode]);

  // We're still using react-query for memory caching and UI state management
  // but adding localStorage as a persistence layer
  const {
    data: patients,
    isLoading,
    error,
    isInitialLoading,
    refetch
  } = useQuery({
    queryKey: ['patients', searchQuery, isDemoMode],
    queryFn: async () => {
      // For demo mode or searches, always fetch fresh data
      if (isDemoMode || searchQuery) {
        return fetchPatients();
      }
      
      // For normal mode without search, use cache
      return getCachedOrFetch(getCacheKey(), fetchPatients, 5 * 60 * 1000); // 5 min TTL
    },
    retry: 2,
    staleTime: 60000 // 1 minute
  });

  // Handle error with toast
  useEffect(() => {
    if (error) {
      console.error('Error loading patients:', error);
      toast.error("Error loading patients. Please try again.");
    }
  }, [error]);

  return {
    patients,
    isLoading,
    error,
    isInitialLoading,
    refetch
  };
};
