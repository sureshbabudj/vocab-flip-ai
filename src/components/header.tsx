import React, { useState } from 'react';
import { GoogleSignOut } from '../GoogleSignIn';
import { useAuthStore } from '../store/authStore';
import { ImportExport } from './ImportExport';
import { FolderSyncIcon } from 'lucide-react';

export function Header() {
  const { clearAuth } = useAuthStore();
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  return (
    <>
      <div className="flex justify-between py-2">
        <h1 className="flex flex-row items-center gap-2 text-xl font-bold text-center text-blue-700">
          <img src="/pwa-192.png" className="w-8 h-8" />
          <span className="sm:inline">VocabFlip AI</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportExportOpen(true)}
            className="flex flex-row items-center gap-2 border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white rounded-md px-3 py-1 text-sm transition-colors"
            title="Import/Export Cards"
          >
            <FolderSyncIcon className="w-4 h-4" />{' '}
            <span className="hidden sm:inline">Import/Export</span>
          </button>
          <GoogleSignOut
            handleLogoutSuccess={() => {
              clearAuth();
            }}
          />
        </div>
      </div>

      <ImportExport
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </>
  );
}
