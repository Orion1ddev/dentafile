import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/stores/useLanguage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!email || !password) {
      toast.error(t('all_fields_required'));
      return;
    }
    
    setIsLoading(true);

    try {
      // Get the current origin without any trailing slashes
      const origin = window.location.origin.replace(/\/$/, '');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          redirectTo: `${origin}/auth`
        }
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      toast.success(t('login_success'));
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || t('login_error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('login_title')}
      </h2>
      <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full"
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
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('logging_in')}
            </>
          ) : (
            t('login')
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => navigate('/auth/signup')}
          disabled={isLoading}
        >
          {t('create_account')}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;