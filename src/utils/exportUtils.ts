import { supabase } from "@/integrations/supabase/client";

export const exportPatientsToCSV = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    // Fetch all patients for the current user
    const { data: patients, error } = await supabase
      .from('patients')
      .select(`
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        medical_history
      `)
      .eq('user_id', user.id);

    if (error) throw error;

    if (!patients || patients.length === 0) {
      throw new Error("No patients found");
    }

    // Convert patients data to CSV format
    const headers = ["First Name", "Last Name", "Date of Birth", "Gender", "Phone", "Email", "Medical History"];
    const csvRows = [headers];

    patients.forEach(patient => {
      csvRows.push([
        patient.first_name,
        patient.last_name,
        patient.date_of_birth,
        patient.gender,
        patient.phone || '',
        patient.email || '',
        (patient.medical_history || []).join('; ')
      ]);
    });

    // Create CSV content
    const csvContent = csvRows.map(row => row.map(cell => 
      `"${String(cell).replace(/"/g, '""')}"`
    ).join(',')).join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `patients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error: any) {
    console.error('Export error:', error);
    throw error;
  }
};