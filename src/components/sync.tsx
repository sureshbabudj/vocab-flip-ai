import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { ImportExport } from './ImportExport';

export const Sync = ({ children }: React.PropsWithChildren) => {
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  return (
    <Dialog open={isImportExportOpen} onOpenChange={setIsImportExportOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg p-0">
        <ImportExport
          isOpen={isImportExportOpen}
          onClose={() => setIsImportExportOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
