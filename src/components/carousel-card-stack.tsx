import React, { useState, useCallback, useMemo } from 'react';
import { type FlashCard, useFlashCardStore } from '../store/flashCardStore';
import { Button } from './ui/button';
import { ArrowLeftIcon, ArrowRightIcon, RotateCcwIcon } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { Card } from './ui/card';
import { TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useToast } from '../hooks/use-toast';

interface CarouselCardProps {
  card: FlashCard;
  onDifficulty: (difficulty: 'easy' | 'hard') => void;
}

const CarouselCard: React.FC<CarouselCardProps> = ({ card, onDifficulty }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const removeCard = useFlashCardStore((s) => s.removeCard);
  const { toast } = useToast();

  const handleDelete = () => {
    removeCard(card.id);
    toast({
      title: 'Card deleted',
      description: `Removed "${card.german}" from your flashcards.`,
      variant: 'default',
    });
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleDifficulty = (difficulty: 'easy' | 'hard') => {
    onDifficulty(difficulty);
  };

  return (
    <div className="w-full h-full p-4">
      <Card className="w-full h-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="perspective w-full h-full relative">
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            style={{ minHeight: '18rem', maxHeight: '28rem' }}
          >
            {/* Front */}
            <Card
              className="absolute w-full h-full backface-hidden bg-gradient-to-br from-accent to-background/80 text-card-foreground border-3 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
              style={{ minHeight: '18rem', maxHeight: '28rem' }}
              onClick={handleFlip}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                    {card.german}
                  </div>
                  <div className="text-muted-foreground text-base font-medium">
                    Tap to reveal translation
                  </div>
                </div>
              </div>

              {/* Delete button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 right-4 z-10 w-10 h-10 border-2 bg-destructive text-background rounded-full"
                    onClick={(e) => e.stopPropagation()}
                    tabIndex={-1}
                    aria-label="Delete card"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="min-w-72">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the card "{card.german}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Card>

            {/* Back */}
            <Card
              className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-card to-card/80 text-card-foreground border-3 border-red-700 shadow-xl p-6 overflow-y-auto"
              style={{ minHeight: '18rem', maxHeight: '28rem' }}
              onClick={handleFlip}
            >
              <div className="flex flex-col h-full">
                <div className="flex flex-col items-center justify-center flex-shrink-0 mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-center leading-tight">
                    {card.translation}
                  </div>
                  <div className="text-muted-foreground text-base font-medium">
                    Tap to hide
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="w-full flex flex-col gap-4">
                    {card.details?.example && (
                      <div className="flex flex-col space-y-4 text-sm">
                        <div className="text-xs uppercase font-bold text-primary mb-2 tracking-wider">
                          Example
                        </div>
                        <span className="text-primary font-semibold">
                          German:
                        </span>
                        <blockquote className="border-l-4 border-primary pl-2 italic bg-muted/30">
                          {card.details.example.original}
                        </blockquote>
                        <span className="text-primary font-semibold">
                          English:
                        </span>
                        <blockquote className="border-l-4 border-primary pl-2 italic bg-muted/30">
                          {card.details.example.translated}
                        </blockquote>
                      </div>
                    )}
                    {card.details?.verbForms?.length > 0 && (
                      <div className="">
                        <div className="text-xs uppercase font-bold mb-2 tracking-wider">
                          Verb Forms
                        </div>
                        <div className="text-sm text-foreground font-medium">
                          {card.details.verbForms.join(', ')}
                        </div>
                      </div>
                    )}
                    {card.details?.otherTranslations?.length > 0 && (
                      <div className="">
                        <div className="text-xs uppercase font-bold mb-2 tracking-wider">
                          Other Translations
                        </div>
                        <div className="text-sm text-foreground font-medium">
                          {card.details.otherTranslations.join(', ')}
                        </div>
                      </div>
                    )}
                    {card.details?.synonyms?.length > 0 && (
                      <div className="">
                        <div className="text-xs uppercase font-bold mb-2 tracking-wider">
                          Synonyms
                        </div>
                        <div className="text-sm text-foreground font-medium">
                          {card.details.synonyms.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Difficulty buttons */}
                <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="flex-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficulty('hard');
                    }}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Hard to Remember
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDifficulty('easy');
                    }}
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Easy to Remember
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const CarouselCardStack: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [difficultyHistory, setDifficultyHistory] = useState<
    Array<{ card: FlashCard; difficulty: 'easy' | 'hard' }>
  >([]);

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

  const handleDifficulty = useCallback(
    (difficulty: 'easy' | 'hard') => {
      if (currentIndex >= filteredCards.length) return;

      const currentCard = filteredCards[currentIndex];
      setDifficultyHistory((prev) => [
        ...prev,
        { card: currentCard, difficulty },
      ]);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, filteredCards],
  );

  const handlePrevious = useCallback(() => {
    if (difficultyHistory.length > 0) {
      setDifficultyHistory((prev) => prev.slice(0, -1));
      setCurrentIndex((prev) => prev - 1);
    }
  }, [difficultyHistory.length]);

  const handleReset = useCallback(() => {
    setCurrentIndex(0);
    setDifficultyHistory([]);
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
          Add some flash cards to start practicing with the carousel interface!
        </p>
      </div>
    );
  }

  // If all cards have been rated, show completion state
  if (currentIndex >= filteredCards.length) {
    const easyCount = difficultyHistory.filter(
      (h) => h.difficulty === 'easy',
    ).length;
    const hardCount = difficultyHistory.filter(
      (h) => h.difficulty === 'hard',
    ).length;

    return (
      <div className="flex flex-col items-center justify-center h-[calc(100dvh-200px)] text-center space-y-6 p-6">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-foreground">Great job!</h3>
        <p className="text-muted-foreground max-w-md">
          You've rated all {filteredCards.length} cards.
        </p>
        <div className="flex gap-4 text-sm">
          <div className="bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <span className="font-semibold">{easyCount}</span> Easy
          </div>
          <div className="bg-red-100 text-red-800 px-3 py-2 rounded-lg">
            <span className="font-semibold">{hardCount}</span> Hard
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleReset}
            className="flex items-center gap-2"
            variant="outline"
          >
            <RotateCcwIcon className="w-4 h-4" />
            Start Over
          </Button>
          {difficultyHistory.length > 0 && (
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

      {/* Carousel container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {filteredCards.map((card, index) => (
              <CarouselItem key={card.id}>
                <CarouselCard card={card} onDifficulty={handleDifficulty} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden" />
          <CarouselNext className="hidden" />
        </Carousel>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4 p-4">
        <Button
          onClick={handlePrevious}
          disabled={difficultyHistory.length === 0}
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
          onClick={() => handleDifficulty('easy')}
          disabled={currentIndex >= filteredCards.length}
          variant="outline"
          size="icon"
          className="w-12 h-12 rounded-full"
          aria-label="Mark as easy"
        >
          <ArrowRightIcon className="w-5 h-5" />
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center text-xs text-muted-foreground pb-4 px-4">
        <p>
          Flip card to see translation • Use difficulty buttons • Swipe or use
          navigation
        </p>
      </div>
    </div>
  );
};
