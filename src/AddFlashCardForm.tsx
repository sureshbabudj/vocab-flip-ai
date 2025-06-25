import React, { useState } from 'react';
import { useFlashCardStore } from './store/flashCardStore';
import { translateText } from './api/geminiApi';
import { XIcon, PlusIcon, Loader2Icon, FilterIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { useToast } from './hooks/use-toast';
import { Card } from './components/ui/card';
import { Filters } from './components/filters';

const AddFlashCardForm: React.FC = () => {
  const cards = useFlashCardStore((s) => s.cards);
  const addCard = useFlashCardStore((s) => s.addCard);
  const [german, setGerman] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!german.trim()) {
      toast({
        title: 'Error',
        description: `Please enter a German word or phrase`,
        variant: 'destructive',
      });
      return;
    }
    const existingCard = cards.find(
      (card) => card.german.toLowerCase() === german.trim().toLowerCase(),
    );
    if (existingCard) {
      toast({
        title: 'Info',
        description: `You already have this card in your deck.`,
        variant: 'default',
      });
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
      toast({
        title: 'Card added!',
        description: `Added "${german.trim()}" to your flashcards.`,
        variant: 'default',
      });
    } catch (err: any) {
      const errorMessage =
        'Failed to fetch translation: ' + (err?.message || err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-between items-center p-2">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-row gap-2 border-2 rounded-full p-1 relative hover:shadow-md max-w-xl justify-center mx-auto"
      >
        <Input
          type="text"
          value={german}
          onChange={(e) => setGerman(e.target.value)}
          placeholder="Enter German word or phrase..."
          disabled={loading}
          className="text-sm rounded-full  border-none focus:border-none !outline-none !ring-0"
        />
        <Button
          type="submit"
          disabled={loading}
          variant="ghost"
          className="absolute right-1 top-1 rounded-full bg-accent-foreground/40 hover:bg-primary/50 w-10 h-10 shadow-sm hover:shadow-md"
        >
          {!loading ? (
            <PlusIcon className="w-5 h-5" />
          ) : (
            <Loader2Icon className="w-5 h-5" />
          )}
        </Button>
      </form>

      <Filters>
        <Button
          variant="outline"
          className="rounded-full w-12 h-12  bg-accent-foreground/40 hover:bg-primary/50 shadow-lg"
        >
          <FilterIcon className="w-6 h-6" />
        </Button>
      </Filters>
    </div>
  );
};

export default AddFlashCardForm;
