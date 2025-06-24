import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from './store/authStore';

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
    <div>
      <button
        onClick={() => login()}
        className="w-full bg-green-600 text-white hover:bg-green-700 hover:text-white rounded-md py-2 text-sm"
      >
        Login with Google
      </button>
    </div>
  );
}
export function GoogleSignOut({
  handleLogoutSuccess,
}: {
  handleLogoutSuccess: () => void;
}) {
  return (
    <>
      <button
        onClick={() => {
          googleLogout();
          handleLogoutSuccess();
        }}
        // outline button
        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-md px-3 py-1 text-sm"
      >
        Sign Out
      </button>
    </>
  );
}
