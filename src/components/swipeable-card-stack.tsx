import React, { useState, useCallback, useMemo } from 'react';
import { type FlashCard, useFlashCardStore } from '../store/flashCardStore';
import { SwipeableCard } from './swipeable-card';
import { Button } from './ui/button';
import { ArrowLeftIcon, ArrowRightIcon, RotateCcwIcon } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

export const SwipeableCardStack: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipedCards, setSwipedCards] = useState<FlashCard[]>([]);
  const { toast } = useToast();

  // Get store state
  const cards = useFlashCardStore((state) => state.cards);
  const sortBy = useFlashCardStore((state) => state.sortBy);
  const searchTerm = useFlashCardStore((state) => state.searchTerm);
  const searchField = useFlashCardStore((state) => state.searchField);
  const currentLetter = useFlashCardStore((state) => state.currentLetter);
  const sortDirection = useFlashCardStore((state) => state.sortDirection);

  // Apply the same filtering logic as FlashCardList
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

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      if (currentIndex >= filteredCards.length) return;

      const currentCard = filteredCards[currentIndex];
      setSwipedCards((prev) => [...prev, currentCard]);

      // Move to next card immediately without intrusive toast
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, filteredCards],
  );

  const handlePrevious = useCallback(() => {
    if (swipedCards.length > 0) {
      setSwipedCards((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => prev - 1);
    }
  }, [swipedCards.length]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setSwipedCards([]);
    // Remove intrusive toast - just reset silently
  }, []);

  // If no cards, show empty state
  if (filteredCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-200px)] text-center space-y-4 p-6">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-foreground">
          No cards to study
        </h3>
        <p className="text-muted-foreground max-w-md">
          Add some flash cards to start practicing with the Tinder-style
          interface!
        </p>
      </div>
    );
  }

  // If all cards have been swiped, show completion state
  if (currentIndex >= filteredCards.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-200px)] text-center space-y-6 p-6">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-foreground">Great job!</h3>
        <p className="text-muted-foreground max-w-md">
          You've gone through all {filteredCards.length} cards.
          {swipedCards.length > 0 && (
            <span> You swiped through {swipedCards.length} cards.</span>
          )}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={handleReset}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RotateCcwIcon className="w-4 h-4" />
            Start Over
          </Button>
          {swipedCards.length > 0 && (
            <Button
              onClick={handlePrevious}
              className="flex items-center gap-2"
              variant="outline"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Go Back
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentCard = filteredCards[currentIndex];

  return (
    <div className="flex flex-col h-[calc(100dvh-200px)]">
      {/* Progress indicator */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            {currentIndex + 1} of {filteredCards.length}
          </span>
          <span>
            {Math.round(((currentIndex + 1) / filteredCards.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / filteredCards.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Single card container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md h-full">
          <SwipeableCard
            card={currentCard}
            onSwipe={handleSwipe}
            isActive={true}
          />
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4 p-4">
        <Button
          onClick={handlePrevious}
          disabled={swipedCards.length === 0}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          aria-label="Go to previous card"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>

        <Button
          onClick={handleReset}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          aria-label="Reset to beginning"
        >
          <RotateCcwIcon className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => handleSwipe('right')}
          disabled={currentIndex >= filteredCards.length}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          aria-label="Swipe right"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-muted-foreground pb-4 px-4">
        <p>
          Swipe left (hard) or right (easy) • Tap to flip • Use buttons below
          for navigation
        </p>
      </div>
    </div>
  );
};
