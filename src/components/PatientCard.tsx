import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientCardActions } from "./patient-card/PatientCardActions";
import { PatientFormDialog } from "./PatientFormDialog";
import { Button } from "./ui/button";
import { Edit2 } from "lucide-react";

type Patient = {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  email?: string | null;
  dental_records?: any[];
  pinned?: boolean;
  avatar_url?: string | null;
};

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-shadow group relative"
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={patient.avatar_url || undefined} alt={`${patient.first_name} ${patient.last_name}`} />
            <AvatarFallback>
              {patient.first_name[0]}{patient.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">
              {patient.first_name} {patient.last_name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PatientFormDialog 
            mode="edit" 
            patientId={patient.id}
            trigger={
              <Button variant="ghost" size="icon" onClick={handleEdit}>
                <Edit2 className="h-4 w-4" />
              </Button>
            }
          />
          <PatientCardActions patient={patient} onEditClick={handleEdit} />
        </div>
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};