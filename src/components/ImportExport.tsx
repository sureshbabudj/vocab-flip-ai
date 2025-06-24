import React, { useState, useRef } from 'react';
import { useFlashCardStore } from '../store/flashCardStore';
import type { FlashCard } from '../store/flashCardStore';

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

export const ImportExport: React.FC<ImportExportProps> = ({
  isOpen,
  onClose,
}) => {
  const { cards, importCards, exportCards } = useFlashCardStore();
  const [importError, setImportError] = useState<string>('');
  const [importSuccess, setImportSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsedCards = JSON.parse(content) as FlashCard[];

        // Validate the imported data
        if (!Array.isArray(parsedCards)) {
          throw new Error('Invalid file format: expected an array of cards');
        }

        // Validate each card has required fields

        if (!parsedCards.every(isValidCard)) {
          throw new Error('Invalid card format: missing required fields');
        }

        importCards(parsedCards);
        setImportSuccess(`Successfully imported ${parsedCards.length} cards!`);
        setImportError('');

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        setImportError(
          error instanceof Error ? error.message : 'Failed to parse file',
        );
        setImportSuccess('');
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
          setImportSuccess(
            `Successfully imported ${parsedCards.length} cards!`,
          );
          setImportError('');
        } catch (error) {
          setImportError(
            error instanceof Error ? error.message : 'Failed to parse file',
          );
          setImportSuccess('');
        }
      };
      reader.readAsText(file);
    } else {
      setImportError('Please drop a valid JSON file');
      setImportSuccess('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Import/Export Cards
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Export Cards
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Download your current cards as a JSON file ({cards.length} cards)
            </p>
            <button
              onClick={handleDownload}
              disabled={cards.length === 0}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className="w-5 h-5 inline mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Cards
            </button>
          </div>

          {/* Import Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Import Cards
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a JSON file to import cards (will replace current cards)
            </p>

            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
            >
              <svg
                className="w-12 h-12 text-gray-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-600 mb-2">
                Drag and drop a JSON file here, or
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                browse files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Error/Success Messages */}
            {importError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{importError}</p>
              </div>
            )}
            {importSuccess && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{importSuccess}</p>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <svg
                className="w-5 h-5 text-yellow-400 mr-2 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">
                  Important
                </h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Importing will replace all your current cards. Make sure to
                  export your current cards first if you want to keep them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
