import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PatientCardActions } from "./patient-card/PatientCardActions";

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
      className="cursor-pointer transition-all duration-200 hover:scale-[1.02] group relative bg-gradient-to-br from-card/50 to-accent/30 dark:from-card/80 dark:to-accent/20 backdrop-blur-sm border-accent/20 hover:border-accent/40 dark:border-accent/10 dark:hover:border-accent/30"
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
        <PatientCardActions patient={patient} onEditClick={handleEdit} />
      </CardHeader>
      <CardContent>
      </CardContent>
    </Card>
  );
};