import React, { useRef } from 'react';
import { useFlashCardStore } from '../store/flashCardStore';
import type { FlashCard } from '../store/flashCardStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';

interface ImportExportProps {
  isOpen: boolean;
  onClose: () => void;
}

const isValidCard = (card: any): card is FlashCard => {
  card.createdAt = card.createdAt ?? Date.now();
  card.id = card.id ?? Math.random().toString(36).slice(2);
  return (
    typeof card === 'object' &&
    card !== null &&
    typeof card.german === 'string' &&
    typeof card.translation === 'string'
  );
};

export const ImportExport: React.FC<ImportExportProps> = ({ isOpen }) => {
  const { cards, importCards, exportCards } = useFlashCardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDownload = () => {
    const cardsData = exportCards();
    const dataStr = JSON.stringify(cardsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vocabflip-cards-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: 'Exported!',
      description: `Downloaded ${cards.length} cards as JSON.`,
      variant: 'default',
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedCards = JSON.parse(content) as FlashCard[];
        if (!Array.isArray(parsedCards)) {
          throw new Error('Invalid file format: expected an array of cards');
        }
        if (!parsedCards.every(isValidCard)) {
          throw new Error('Invalid card format: missing required fields');
        }
        importCards(parsedCards);
        toast({
          title: 'Import successful',
          description: `Imported ${parsedCards.length} cards!`,
          variant: 'default',
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        toast({
          title: 'Import error',
          description:
            error instanceof Error ? error.message : 'Failed to parse file',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedCards = JSON.parse(content) as FlashCard[];
          if (!Array.isArray(parsedCards)) {
            throw new Error('Invalid file format: expected an array of cards');
          }
          if (!parsedCards.every(isValidCard)) {
            throw new Error('Invalid card format: missing required fields');
          }
          importCards(parsedCards);
          toast({
            title: 'Import successful',
            description: `Imported ${parsedCards.length} cards!`,
            variant: 'default',
          });
        } catch (error) {
          toast({
            title: 'Import error',
            description:
              error instanceof Error ? error.message : 'Failed to parse file',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: 'Import error',
        description: 'Please drop a valid JSON file',
        variant: 'destructive',
      });
    }
  };

  if (!isOpen) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import/Export Cards</CardTitle>
        <CardDescription>
          Backup or restore your flash cards as JSON.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Export Section */}
        <div>
          <Label className="text-base font-semibold mb-2 block">
            Export Cards
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Download your current cards as a JSON file ({cards.length} cards)
          </p>
          <Button
            onClick={handleDownload}
            disabled={cards.length === 0}
            className="w-full"
          >
            Download Cards
          </Button>
        </div>
        {/* Import Section */}
        <div>
          <Label className="text-base font-semibold mb-2 block">
            Import Cards
          </Label>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a JSON file to import cards (will replace current cards)
          </p>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors"
          >
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop a JSON file here, or
            </p>
            <Button
              variant="link"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:text-primary/80 font-medium"
            >
              Browse files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>
        {/* Warning */}
        <div className="mt-4">
          <div className="bg-muted border border-border rounded-md p-4">
            <div className="flex">
              <span className="w-5 h-5 text-muted-foreground mr-2 mt-0.5">
                ⚠️
              </span>
              <div>
                <h4 className="text-sm font-medium text-foreground">
                  Important
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Importing will <b>replace all your current cards</b>. Make
                  sure to export your current cards first if you want to keep
                  them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
