import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
}

export const PatientFilter = ({
  searchQuery,
  onSearchChange,
  selectedGender,
  onGenderChange,
}: PatientFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search patients..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <Select value={selectedGender} onValueChange={onGenderChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by gender" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genders</SelectItem>
          <SelectItem value="male">Male</SelectItem>
          <SelectItem value="female">Female</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};