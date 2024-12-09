import { Input } from "@/components/ui/input";

interface PatientFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const PatientFilter = ({
  searchQuery,
  onSearchChange,
}: PatientFilterProps) => {
  return (
    <div className="mb-6">
      <Input
        placeholder="Search patients..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};