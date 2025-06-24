import React from 'react';
import AddFlashCardForm from './AddFlashCardForm';
import FlashCardList from './FlashCardList';
import { useAuthStore } from './store/authStore';
import { GoogleLogin, GoogleSignOut } from './GoogleSignIn';

const App: React.FC = () => {
  const { clearAuth } = useAuthStore();
  const accessToken = useAuthStore((s) => s.accessToken);
  const authError = useAuthStore((s) => s.authError);

  if (!accessToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
            Sign in to VocabFlip AI
          </h1>
          <GoogleLogin scope="openid email profile" />
          {authError && (
            <div className="text-red-600 text-center mt-4">{authError}</div>
          )}
        </div>
      </div>
    );
  }

  const handleLogoutSuccess = () => {
    clearAuth();
  };

  // Authenticated: show flash card app
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between">
          <h1 className="text-xl font-bold text-center text-blue-700">
            VocabFlip AI
          </h1>
          <GoogleSignOut handleLogoutSuccess={handleLogoutSuccess} />
        </div>
        <AddFlashCardForm />
        <FlashCardList />
      </div>
    </div>
  );
};

export default App;
