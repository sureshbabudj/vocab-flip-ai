import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from './store/authStore';
import { LockOpenIcon } from 'lucide-react';
import { Button } from './components/ui/button';

export function GoogleLogin({ scope }: { scope: string }) {
  const { setAccessToken, setAuthError, clearAuth } = useAuthStore();
  // Initialize the Google Login hook with the desired scope
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      const accessToken = codeResponse.access_token;
      if (accessToken) {
        setAccessToken(accessToken); // Store the Google OAuth access token
        setAuthError(null); // Clear any previous auth errors
      } else {
        setAuthError(
          'Failed to get access token from Google. Please try again.',
        );
        clearAuth();
      }
    },
    onError: (errorResponse) => {
      setAuthError(
        `Google Sign-In failed: ${
          errorResponse.error || 'Unknown error'
        }. Please try again.`,
      );
      clearAuth();
    },
    scope,
    flow: 'implicit',
  });

  return (
    <div className="w-full">
      <Button
        onClick={() => login()}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-primary/20"
      >
        <LockOpenIcon className="w-5 h-5 mr-3" />
        Sign in with Google
      </Button>
    </div>
  );
}
