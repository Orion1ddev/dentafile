import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { PatientCard } from "@/components/PatientCard";
import { PatientFilter } from "@/components/PatientFilter";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState("all");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients', searchQuery, selectedGender],
    queryFn: async () => {
      let query = supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
      }

      if (selectedGender !== 'all') {
        query = query.eq('gender', selectedGender);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
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
            <div className="flex items-center">
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
          />

          {isLoading ? (
            <div className="text-center py-12">Loading patients...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients?.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  onClick={() => navigate(`/patient/${patient.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;