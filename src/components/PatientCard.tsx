import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface PatientCardProps {
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    avatar_url: string;
    medical_history: string[];
  };
  onClick: () => void;
}

export const PatientCard = ({ patient, onClick }: PatientCardProps) => {
  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={patient.avatar_url} alt={`${patient.first_name} ${patient.last_name}`} />
          <AvatarFallback>{patient.first_name[0]}{patient.last_name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold">{patient.first_name} {patient.last_name}</h3>
          <p className="text-sm text-muted-foreground">
            {age} years old • {patient.gender}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {patient.medical_history.map((condition, index) => (
            <span 
              key={index}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
            >
              {condition}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};