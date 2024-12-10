import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    
    if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', patient.id);

    if (error) {
      toast.error('Failed to delete patient');
      return;
    }

    toast.success('Patient deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['patients'] });
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow relative group"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={patient.avatar_url} alt={`${patient.first_name} ${patient.last_name}`} />
          <AvatarFallback>{patient.first_name[0]}{patient.last_name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{patient.first_name} {patient.last_name}</h3>
          <p className="text-sm text-muted-foreground">
            {age} years old • {patient.gender}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
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