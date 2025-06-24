import React, { useState } from 'react';
import { useFlashCardStore } from './store/flashCardStore';
import { translateText } from './api/geminiApi';
import { XIcon } from 'lucide-react';

const AddFlashCardForm: React.FC = () => {
  const cards = useFlashCardStore((s) => s.cards);
  const addCard = useFlashCardStore((s) => s.addCard);
  const [german, setGerman] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!german.trim()) {
      setError('Please enter a German word or phrase.');
      return;
    }
    const existingCard = cards.find(
      (card) => card.german.toLowerCase() === german.trim().toLowerCase(),
    );
    if (existingCard) {
      setError('Card already exists.');
      return;
    }
    setLoading(true);
    try {
      const msg = await translateText(german);
      addCard({
        german: german.trim(),
        translation: msg.translation || '',
        details: msg,
      });
      setGerman('');
    } catch (err: any) {
      setError('Failed to fetch translation: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4 mb-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-row items-center gap-4 "
      >
        <input
          type="text"
          value={german}
          onChange={(e) => setGerman(e.target.value)}
          placeholder="Enter German word or phrase"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && (
        <div className="flex flex-row items-center justify-between border border-red-500 p-2 rounded-md text-red-600 text-sm mt-1 w-full">
          {error}
          <button
            onClick={() => setError('')}
            className="text-xs text-red-600 hover:text-red-700"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddFlashCardForm;
