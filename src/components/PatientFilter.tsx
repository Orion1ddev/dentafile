import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PatientFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
  selectedDisease: string;
  onDiseaseChange: (value: string) => void;
  visitOrder: string;
  onVisitOrderChange: (value: string) => void;
}

export const PatientFilter = ({
  searchQuery,
  onSearchChange,
  selectedGender,
  onGenderChange,
  selectedDisease,
  onDiseaseChange,
  visitOrder,
  onVisitOrderChange,
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
      <Select value={selectedDisease} onValueChange={onDiseaseChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by disease" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Diseases</SelectItem>
          <SelectItem value="diabetes">Diabetes</SelectItem>
          <SelectItem value="hypertension">Hypertension</SelectItem>
          <SelectItem value="asthma">Asthma</SelectItem>
          <SelectItem value="heart_disease">Heart Disease</SelectItem>
        </SelectContent>
      </Select>
      <Select value={visitOrder} onValueChange={onVisitOrderChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Sort by visit date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">Latest Visit First</SelectItem>
          <SelectItem value="oldest">Oldest Visit First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};