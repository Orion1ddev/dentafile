import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PatientCard } from "@/components/PatientCard";
import { PatientFilter } from "@/components/PatientFilter";
import { PatientFormDialog } from "@/components/PatientFormDialog";
import { useQuery } from "@tanstack/react-query";
import type { Database } from "@/integrations/supabase/types";

type Patient = Database['public']['Tables']['patients']['Row'];

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");
  const [selectedDisease, setSelectedDisease] = useState("all");
  const [visitOrder, setVisitOrder] = useState("latest");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients', searchQuery, selectedGender, selectedDisease, visitOrder],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase
        .from('patients')
        .select('*, dental_records(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: visitOrder === 'oldest' });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      if (selectedGender !== 'all') {
        query = query.eq('gender', selectedGender);
      }

      if (selectedDisease !== 'all') {
        query = query.contains('medical_history', [selectedDisease]);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Patient[];
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  };

  if (error) {
    toast.error("Error loading patients");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">DentaFile</h1>
            </div>
            <div className="flex items-center gap-4">
              <PatientFormDialog mode="create" />
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <PatientFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
            selectedDisease={selectedDisease}
            onDiseaseChange={setSelectedDisease}
            visitOrder={visitOrder}
            onVisitOrderChange={setVisitOrder}
          />

          {isLoading ? (
            <div className="text-center py-12">Loading patients...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients?.map((patient) => (
                <div key={patient.id} className="relative">
                  <PatientCard
                    patient={patient}
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  />
                  <div className="absolute top-4 right-4">
                    <PatientFormDialog mode="edit" patient={patient} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;