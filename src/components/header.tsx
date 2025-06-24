import { GoogleSignOut } from '../GoogleSignIn';
import { useAuthStore } from '../store/authStore';

export function Header() {
  const { clearAuth } = useAuthStore();

  return (
    <div className="flex justify-between py-2">
      <h1 className="text-xl font-bold text-center text-blue-700">
        VocabFlip AI
      </h1>
      <GoogleSignOut
        handleLogoutSuccess={() => {
          clearAuth();
        }}
      />
    </div>
  );
}
