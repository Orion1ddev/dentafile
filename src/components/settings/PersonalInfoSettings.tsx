import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/stores/useLanguage";

export const PersonalInfoSettings = () => {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        setFirstName(profile.first_name || "");
        setLastName(profile.last_name || "");
        setGender(profile.gender || "");
      }
    };

    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          gender: gender
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(t('profile_updated'));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('personal_info')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('first_name')}</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('last_name')}</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('gender')}</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('mr')}</SelectItem>
                <SelectItem value="female">{t('mrs')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t('saving') : t('save_changes')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};