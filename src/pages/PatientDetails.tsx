import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";

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
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!patient) {
    return <div>Patient not found</div>;
  }

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
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={patient.avatar_url} alt={`${patient.first_name} ${patient.last_name}`} />
                <AvatarFallback>{patient.first_name[0]}{patient.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {patient.first_name} {patient.last_name}
                </CardTitle>
                <p className="text-muted-foreground">
                  Born: {format(new Date(patient.date_of_birth), 'MMMM d, yyyy')}
                </p>
                <p className="text-muted-foreground">
                  Contact: {patient.phone} • {patient.email}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Medical History</h3>
                  <div className="flex flex-wrap gap-2">
                    {patient.medical_history.map((condition: string, index: number) => (
                      <span
                        key={index}
                        className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Dental Records</h3>
                  <div className="space-y-4">
                    {patient.dental_records.map((record: any) => (
                      <Card key={record.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Visit: {format(new Date(record.visit_date), 'MMMM d, yyyy')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                            <p><strong>Treatment:</strong> {record.treatment}</p>
                            <p><strong>Notes:</strong> {record.notes}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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