
import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignupForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabaseConfigured = isSupabaseConfigured();

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t('all_fields_required'));
      return;
    }
    setShowAdditionalFields(true);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseConfigured) return;
    
    setIsLoading(true);

    if (!email || !password || !firstName || !lastName) {
      toast.error(t('all_fields_required'));
      setIsLoading(false);
      return;
    }

    try {
      // Get the current origin without any trailing slashes
      const origin = window.location.origin.replace(/\/$/, '');
      const redirectTo = `${origin}/auth`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data?.user) {
        toast.success(t('check_email_verification'));
        navigate('/auth');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || t('signup_error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!supabaseConfigured) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertDescription>
          Supabase configuration is missing. Registration is unavailable.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {!showAdditionalFields ? t('sign_up_title') : t('additional_info')}
      </h2>
      <form onSubmit={!showAdditionalFields ? handleInitialSubmit : handleSignUp} className="space-y-4">
        {!showAdditionalFields ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                {t('email')}
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                {t('password')}
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('continue')
              )}
            </Button>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                {t('first_name')}
              </label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                {t('last_name')}
              </label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signing_up')}
                </>
              ) : (
                t('complete_signup')
              )}
            </Button>
          </>
        )}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => !showAdditionalFields ? navigate('/auth') : setShowAdditionalFields(false)}
          disabled={isLoading}
        >
          {!showAdditionalFields ? t('back_to_login') : t('back')}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;
