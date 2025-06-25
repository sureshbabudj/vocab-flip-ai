import React, { useMemo } from 'react';
import { useFlashCardStore, type FlashCard } from './store/flashCardStore';
import FlashCardComponent from './FlashCard';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';

const ResultsSummary = ({ filteredCards }: { filteredCards: FlashCard[] }) => {
  const cards = useFlashCardStore((state) => state.cards);
  const resetAll = useFlashCardStore((state) => state.resetAll);

  return (
    <>
      {/* Results Summary */}
      <div className="flex flex-row gap-2 justify-between items-baseline">
        <p className="text-sm text-muted-foreground font-medium">
          Showing {filteredCards.length} of {cards.length} cards
        </p>
        {filteredCards.length !== cards.length && (
          <Button variant="outline" onClick={() => resetAll()}>
            Reset
          </Button>
        )}
      </div>
    </>
  );
};

const FlashCardList: React.FC = () => {
  const cards = useFlashCardStore((state) => state.cards);
  const sortBy = useFlashCardStore((state) => state.sortBy);
  const searchTerm = useFlashCardStore((state) => state.searchTerm);
  const searchField = useFlashCardStore((state) => state.searchField);
  const currentLetter = useFlashCardStore((state) => state.currentLetter);
  const sortDirection = useFlashCardStore((state) => state.sortDirection);

  const filteredCards = useMemo(() => {
    let filtered = [...cards];

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((card) => {
        switch (searchField) {
          case 'german':
            return card.german.toLowerCase().includes(term);
          case 'translation':
            return card.translation.toLowerCase().includes(term);
          default:
            return (
              card.german.toLowerCase().includes(term) ||
              card.translation.toLowerCase().includes(term)
            );
        }
      });
    }

    // Apply letter filter
    if (currentLetter !== 'all') {
      filtered = filtered.filter(
        (card) => card.german.charAt(0).toUpperCase() === currentLetter,
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'a-z':
        filtered.sort((a, b) => a.german.localeCompare(b.german));
        break;
      case 'z-a':
        filtered.sort((a, b) => b.german.localeCompare(a.german));
        break;
      case 'recent':
        filtered.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.createdAt - b.createdAt);
        break;
    }

    // Apply sort direction for letter pagination
    if (sortBy === 'all' && currentLetter !== 'all') {
      filtered.sort((a, b) => {
        const comparison = a.german.localeCompare(b.german);
        return sortDirection === 'a-z' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [cards, sortBy, searchTerm, searchField, currentLetter, sortDirection]);

  if (filteredCards.length === 0) {
    return (
      <div className="space-y-8 mx-4 my-4">
        <ResultsSummary filteredCards={filteredCards} />
        <Card className="p-12 text-center border-2 border-border/50 bg-card/50 backdrop-blur-sm shadow-lg">
          <div className="space-y-4">
            <div className="text-6xl text-muted-foreground/50">📚</div>
            <h3 className="text-xl font-bold text-foreground">
              No flashcards found
            </h3>
            <p className="text-muted-foreground text-base">
              Try adjusting your filters or add a new word to get started!
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 mx-4 my-4">
      <ResultsSummary filteredCards={filteredCards} />
      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCards.map((card) => (
          <FlashCardComponent key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default FlashCardList;
