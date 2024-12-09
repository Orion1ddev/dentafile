import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parse } from "date-fns";
import { ChevronLeft } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { DentalRecordFormDialog } from "@/components/DentalRecordFormDialog";
import { PatientFormDialog } from "@/components/PatientFormDialog";
import { DentalRecordEditDialog } from "@/components/DentalRecordEditDialog";

type PatientWithRecords = Database['public']['Tables']['patients']['Row'] & {
  dental_records: Database['public']['Tables']['dental_records']['Row'][];
};

const PatientDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: patient, isLoading } = useQuery({
    queryKey: ['patient', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          dental_records (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as PatientWithRecords;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

  // Format the date for display
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="mr-4"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
            </div>
            <div className="flex items-center gap-2">
              <PatientFormDialog patient={patient} mode="edit" />
              <DentalRecordFormDialog patientId={patient.id} />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">
                {patient.first_name} {patient.last_name}
              </CardTitle>
              <div className="text-muted-foreground">
                <p>Born: {formatDisplayDate(patient.date_of_birth)}</p>
                <p>Contact: {patient.phone || 'N/A'} • {patient.email || 'N/A'}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-semibold mb-2">Dental Records</h3>
                <div className="space-y-4">
                  {patient.dental_records?.map((record) => (
                    <Card key={record.id}>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">
                          Visit: {formatDisplayDate(record.visit_date)}
                        </CardTitle>
                        <DentalRecordEditDialog record={record} patientId={patient.id} />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p><strong>Diagnosis:</strong> {record.diagnosis || 'N/A'}</p>
                            <p><strong>Treatment:</strong> {record.treatment || 'N/A'}</p>
                            <p><strong>Notes:</strong> {record.notes || 'N/A'}</p>
                          </div>
                          {record.images && record.images.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Photos</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {record.images.map((image, index) => (
                                  <img
                                    key={index}
                                    src={image}
                                    alt={`Dental record ${index + 1}`}
                                    className="rounded-lg object-cover w-full aspect-square"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientDetails;