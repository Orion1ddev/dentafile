import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CardContent } from "@/components/ui/card";
import { useLanguage } from "@/stores/useLanguage";
import { PatientHeader } from "@/components/PatientHeader";
import { PatientInfo } from "@/components/PatientInfo";
import { DentalRecordsList } from "@/components/DentalRecordsList";
import BuyMeCoffeeButton from "@/components/BuyMeCoffeeButton";
import type { Patient, DentalRecord } from "@/types/supabase";

type PatientWithRecords = Patient & {
  dental_records: DentalRecord[];
};

const PatientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLanguage();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: patient, isLoading } = useQuery<PatientWithRecords>({
    queryKey: ['patient', id],
    queryFn: async () => {
      if (!id) throw new Error("No patient ID provided");

      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          dental_records (*)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching patient:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error("Patient not found");
      }

      return data as PatientWithRecords;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">{t('patient_not_found')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PatientHeader patient={patient} />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div>
          <PatientInfo patient={patient} />
          <CardContent className="p-0">
            <div>
              <h3 className="font-semibold mb-2">{t('dental_records')}</h3>
              <DentalRecordsList 
                records={patient.dental_records} 
                patientId={patient.id} 
              />
            </div>
          </CardContent>
        </div>
      </main>
      <div className="fixed bottom-4 right-4">
        <BuyMeCoffeeButton />
      </div>
    </div>
  );
};

export default PatientDetails;