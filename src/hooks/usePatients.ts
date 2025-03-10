
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useCallback } from "react";
import { getCachedOrFetch } from "@/utils/apiCache";

export const usePatients = (searchQuery: string) => {
  const fetchPatients = useCallback(async () => {
    try {
      console.log('Fetching patients data, search query:', searchQuery);
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
  }, [searchQuery]);

  const getCacheKey = useCallback(() => {
    return `patients_${searchQuery || 'all'}`;
  }, [searchQuery]);

  // We're still using react-query for memory caching and UI state management
  // but adding localStorage as a persistence layer
  const {
    data: patients,
    isLoading,
    error,
    isInitialLoading,
    refetch
  } = useQuery({
    queryKey: ['patients', searchQuery],
    queryFn: async () => {
      // Only use cache for non-search requests
      if (!searchQuery) {
        return getCachedOrFetch(getCacheKey(), fetchPatients, 5 * 60 * 1000); // 5 min TTL
      }
      // For searches, always fetch fresh data
      return fetchPatients();
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
