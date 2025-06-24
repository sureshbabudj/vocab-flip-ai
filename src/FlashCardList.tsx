import React, { useMemo } from 'react';
import { useFlashCardStore } from './store/flashCardStore';
import FlashCardComponent from './FlashCard';

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
      <div className="text-gray-500 text-center mt-8">
        No flash cards found. Try adjusting your filters or add a new word!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-4">
      {filteredCards.map((card) => (
        <FlashCardComponent key={card.id} card={card} />
      ))}
    </div>
  );
};

export default FlashCardList;
