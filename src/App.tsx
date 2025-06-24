import React from 'react';
import AddFlashCardForm from './AddFlashCardForm';
import FlashCardList from './FlashCardList';
import { useAuthStore } from './store/authStore';
import { GoogleLogin, GoogleSignOut } from './GoogleSignIn';
import { Header } from './components/header';

const App: React.FC = () => {
  const { clearAuth } = useAuthStore();
  const accessToken = useAuthStore((s) => s.accessToken);
  const authError = useAuthStore((s) => s.authError);

  if (accessToken) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-10 py-6">
        <div>
          <img
            src="/favicon.svg"
            alt="VocabFlip AI"
            className="w-full h-auto max-w-62 p-5"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Sign in to VocabFlip AI
        </h1>
        <GoogleLogin scope="openid email profile" />
        {authError && (
          <div className="text-red-600 text-center mt-4">{authError}</div>
        )}
      </div>
    );
  }

  // Authenticated: show flash card app
  return (
    <div className="min-h-dvh bg-gray-50 flex flex-col items-center px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-2xl">
        <Header />
        <AddFlashCardForm />
        <FlashCardList />
      </div>
    </div>
  );
};

export default App;
