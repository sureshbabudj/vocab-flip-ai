import React from 'react';
import AddFlashCardForm from './AddFlashCardForm';
import FlashCardList from './FlashCardList';
import { useAuthStore } from './store/authStore';
import { GoogleLogin } from './GoogleSignIn';
import { Header } from './components/header';
import { Toaster } from './components/ui/toaster';
import { BottomBar } from './components/bottom-bar';
import { PWAUpdate } from './components/pwa-update';
import { PWAInstall } from './components/pwa-install';
import { ThemeColorManager } from './components/theme-color-manager';

const App: React.FC = () => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const authError = useAuthStore((s) => s.authError);

  if (!accessToken) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-8 py-8 px-6 bg-background">
        {/* Logo Section - Primary Focal Point */}
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-foreground leading-tight">
            Welcome to
          </h1>
          <div className="relative">
            <img
              src="/favicon.svg"
              alt="VocabFlip AI"
              className="w-full max-w-56 h-auto rounded-xl bg-blend-multiply"
            />
            <div className="absolute -inset-4 bg-primary/10 rounded-full blur-xl"></div>
          </div>

          <p className="text-muted-foreground text-center text-lg max-w-md leading-relaxed">
            Master German vocabulary with AI-powered flashcards
          </p>
        </div>

        {/* Sign-in Section - Secondary Focal Point */}
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <div className="w-full">
            <GoogleLogin scope="openid email profile" />
          </div>
          {authError && (
            <div className="w-full p-4 border-2 border-destructive/20 bg-destructive/5 rounded-lg text-destructive text-center text-sm font-medium">
              {authError}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Authenticated: show flash card app
  return (
    <div className="min-h-dvh bg-background font-sans">
      <ThemeColorManager />
      <div className="container mx-auto">
        <Header />
        <AddFlashCardForm />
        <FlashCardList />
      </div>
      <BottomBar />
      <PWAUpdate />
      <PWAInstall />
      <Toaster />
    </div>
  );
};

export default App;
