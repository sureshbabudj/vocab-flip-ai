import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Download, X, Smartphone } from 'lucide-react';

export const PWAInstall: React.FC = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isPWA) return;

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showInstallPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 md:max-w-md md:left-auto md:bottom-4">
      <Card className="p-4 border-2 border-primary/20 bg-primary/5 backdrop-blur-sm shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Smartphone className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Install VocabFlip AI
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Install this app on your device for quick and easy access when
              you're on the go.
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium"
              >
                <Download className="w-3 h-3 mr-1" />
                Install App
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={dismissPrompt}
                className="text-xs"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
