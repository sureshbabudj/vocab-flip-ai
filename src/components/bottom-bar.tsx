import { useAuthStore } from '../store/authStore';
import { googleLogout } from '@react-oauth/google';
import {
  FilterIcon,
  LogOutIcon,
  PlusIcon,
  BookOpenIcon,
  FolderSyncIcon,
} from 'lucide-react';
import { Button } from './ui/button';
import { Filters } from './filters';
import { ThemeToggle } from './ThemeToggle';
import { useFlashCardStore } from '@/store/flashCardStore';
import { Sync } from './sync';

export const BottomBar = () => {
  const { clearAuth } = useAuthStore();
  const viewMode = useFlashCardStore((s) => s.viewMode);
  const setViewMode = useFlashCardStore((s) => s.setViewMode);

  const handleSignOut = () => {
    googleLogout();
    clearAuth();
  };

  return (
    <>
      {/* Mobile Bottom Bar - Only visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t-2 border-border/50 shadow-2xl">
        <div className="flex items-center justify-around px-4 py-2">
          {/* Home/Add Card Button */}
          {viewMode === 'swipe' ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-12 w-12 rounded-xl hover:bg-primary/10 transition-all duration-200"
              onClick={() => {
                if (viewMode === 'swipe') {
                  setViewMode('list');
                }
                // Scroll to top and focus on add card form
                window.scrollTo({ top: 0, behavior: 'smooth' });
                const input = document.querySelector(
                  'input[placeholder*="German"]',
                ) as HTMLInputElement;
                if (input) {
                  setTimeout(() => input.focus(), 500);
                }
              }}
            >
              <PlusIcon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Add
              </span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-12 w-12 rounded-xl hover:bg-primary/10 transition-all duration-200"
              onClick={() => {
                if (viewMode === 'list') {
                  setViewMode('swipe');
                }
              }}
            >
              <BookOpenIcon className="w-6 h-6 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">
                Study
              </span>
            </Button>
          )}

          <Sync>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-12 w-12 rounded-xl hover:bg-accent/10 transition-all duration-200"
            >
              <FolderSyncIcon className="w-6 h-6 text-primary" />{' '}
              <span className="text-xs font-medium text-muted-foreground">
                Sync
              </span>
            </Button>
          </Sync>

          <Filters>
            <Button
              variant="ghost"
              size="sm"
              className="flex flex-col items-center gap-1 h-12 w-12 rounded-xl hover:bg-accent/10 transition-all duration-200"
            >
              <FilterIcon className="w-6 h-6 text-primary" />{' '}
              <span className="text-xs font-medium text-muted-foreground">
                Filters
              </span>
            </Button>
          </Filters>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-12 w-12 rounded-xl hover:bg-accent/10 transition-all duration-200"
          >
            <ThemeToggle />
            Theme
          </Button>

          {/* Sign Out Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="flex flex-col items-center gap-1 h-12 w-12 rounded-xl hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOutIcon className="w-6 h-6 text-destructive" />
            <span className="text-xs font-medium text-muted-foreground">
              Sign Out
            </span>
          </Button>
        </div>
      </div>

      {/* Bottom padding for mobile to prevent content from being hidden behind bottom bar */}
      <div className="md:hidden h-20"></div>
    </>
  );
};
