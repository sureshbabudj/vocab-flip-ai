import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { ImportExport } from './ImportExport';
import { FolderSyncIcon, LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { ThemeToggle } from './ThemeToggle';
import { googleLogout } from '@react-oauth/google';
import { Sync } from './sync';

export function Header() {
  const { clearAuth } = useAuthStore();
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  return (
    <div className="flex justify-between items-center border-none px-2 py-4">
      {/* Brand Section - Primary Focal Point */}
      <div className="flex flex-row items-center flex-1 justify-center sm:flex-none sm:justify-start">
        <h1 className="text-2xl sm:text-3xl">
          <span className="font-brand text-purple-600 dark:text-purple-400">
            Vocab
          </span>
          <span className="font-extrabold text-red-600 dark:text-red-400">
            Flip
          </span>
        </h1>
      </div>

      {/* Action Buttons - Secondary Focal Points */}
      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm">
          <ThemeToggle />
        </Button>

        <Sync>
          <Button variant="outline" size="sm" title="Import/Export Cards">
            <FolderSyncIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Import/Export</span>
          </Button>
        </Sync>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            googleLogout();
            clearAuth();
          }}
        >
          <LogOutIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
