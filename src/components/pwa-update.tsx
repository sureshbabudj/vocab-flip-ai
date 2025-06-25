import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { RefreshCw, X, Download } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

interface PWAUpdateProps {
  onUpdate?: () => void;
}

export const PWAUpdate: React.FC<PWAUpdateProps> = ({ onUpdate }) => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if PWA is installed
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (!isPWA) return;

    // Listen for Vite PWA's built-in update events
    const handleUpdateFound = () => {
      console.log('PWA Update: Update found');
      setUpdateAvailable(true);
      toast({
        title: 'Update Available',
        description: 'A new version of VocabFlip AI is available!',
        variant: 'default',
      });
    };

    // Check for service worker updates
    const checkForUpdates = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            // Check if there's a waiting service worker
            if (registration.waiting) {
              handleUpdateFound();
            }

            // Listen for future updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (
                    newWorker.state === 'installed' &&
                    navigator.serviceWorker.controller
                  ) {
                    handleUpdateFound();
                  }
                });
              }
            });
          }
        } catch (error) {
          console.error('PWA Update: Error checking for updates:', error);
        }
      }
    };

    // Initial check
    checkForUpdates();

    // Check periodically (every 30 minutes)
    const interval = setInterval(checkForUpdates, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [toast]);

  const handleUpdate = async () => {
    setUpdating(true);

    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          console.log('PWA Update: Applying update');

          // Send message to service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });

          // Reload the page after a short delay
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          console.log('PWA Update: No waiting service worker found');
          setUpdating(false);
        }
      }
    } catch (error) {
      console.error('PWA Update: Update failed:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update the app. Please try again.',
        variant: 'destructive',
      });
      setUpdating(false);
    }
  };

  const dismissUpdate = () => {
    setDismissed(true);
    setUpdateAvailable(false);
  };

  // Don't render if no update, dismissed, or not a PWA
  if (!updateAvailable || dismissed) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:max-w-md md:left-auto">
      <Card className="p-4 border-2 border-primary/20 bg-primary/5 backdrop-blur-sm shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Update Available
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              A new version of VocabFlip AI is ready to install. Update now to
              get the latest features and improvements.
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                disabled={updating}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium"
              >
                {updating ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Download className="w-3 h-3 mr-1" />
                    Update Now
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={dismissUpdate}
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
