import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SignupForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            gender: gender
          }
        }
      });

      if (error) throw error;

      toast({
        title: t('success'),
        description: t('check_email_verification'),
      });

      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error'),
        description: error.message,
      });
    }
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error_description');
        
        if (error?.includes('User already registered')) {
          toast({
            variant: "destructive",
            title: t('account_exists'),
            description: t('try_login_instead'),
          });
          navigate('/auth');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate, t]);

  if (!showAdditionalFields) {
    return (
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {t('sign_up_title')}
        </h2>
        <div className="space-y-4">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'rgb(37 99 235)',
                  color: 'white',
                  borderRadius: '0.375rem',
                },
                input: {
                  borderRadius: '0.375rem',
                },
                message: {
                  borderRadius: '0.375rem',
                }
              }
            }}
            view="sign_up"
            showLinks={true}
            providers={[]}
            redirectTo={`${window.location.origin}/auth`}
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              setEmail(formData.get('email') as string);
              setPassword(formData.get('password') as string);
              setShowAdditionalFields(true);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('additional_info')}
      </h2>
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="firstName">
            {t('first_name')}
          </label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
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
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="gender">
            {t('gender')}
          </label>
          <Select value={gender} onValueChange={setGender} required>
            <SelectTrigger>
              <SelectValue placeholder={t('select_gender')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t('mr')}</SelectItem>
              <SelectItem value="female">{t('mrs')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">
          {t('complete_signup')}
        </Button>
      </form>
    </div>
  );
};

export default SignupForm;