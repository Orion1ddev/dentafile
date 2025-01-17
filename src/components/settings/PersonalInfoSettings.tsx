import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/stores/useLanguage";

export const PersonalInfoSettings = () => {
  const { t } = useLanguage();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error(t("user_not_authenticated"));
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error loading profile:', error);
          toast.error(t("failed_load_profile"));
          return;
        }

        if (profile) {
          setFirstName(profile.first_name || "");
          setLastName(profile.last_name || "");
        } else {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: user.id }]);

          if (insertError) {
            console.error('Error creating profile:', insertError);
            toast.error(t("failed_create_profile"));
          }
        }
      } catch (error) {
        console.error('Profile loading error:', error);
        toast.error(t("failed_load_profile"));
      }
    };

    loadProfile();
  }, [t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error(t("user_not_authenticated"));

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(t("profile_updated"));
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || t("profile_update_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personal_info")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("first_name")}</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={t("enter_first_name")}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("last_name")}</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder={t("enter_last_name")}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("saving") : t("save_changes")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};