
import { PatientCard } from "@/components/PatientCard";
import { PatientFilter } from "@/components/PatientFilter";
import { useLanguage } from "@/stores/useLanguage";
import { useNavigate } from "react-router-dom";
import { Loading } from "@/components/ui/loading";
import { useState, useEffect } from "react";

interface PatientsListViewProps {
  patients: any[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const PatientsListView = ({
  patients,
  isLoading,
  searchQuery,
  onSearchChange
}: PatientsListViewProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  
  // Track when user is actively searching
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  return (
    <>
      <PatientFilter searchQuery={searchQuery} onSearchChange={onSearchChange} />
      {isLoading && !isSearching ? (
        <div className="text-center py-12">
          <Loading size="small" text={t('loading')} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {patients?.length ? (
            patients.map(patient => (
              <PatientCard 
                key={patient.id} 
                patient={patient} 
                onClick={() => navigate(`/patient/${patient.id}`)} 
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              {searchQuery ? (
                <p className="text-muted-foreground">No patients found matching your search</p>
              ) : (
                <p className="text-muted-foreground">No patients found. Add your first patient to get started.</p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
