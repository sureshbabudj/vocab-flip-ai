import React, { useState, useRef, useEffect } from 'react';
import { type FlashCard, useFlashCardStore } from '../store/flashCardStore';
import { TrashIcon, CheckIcon, XIcon } from 'lucide-react';
import { Button } from './ui/button';
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
import { Card } from './ui/card';
import { useToast } from '../hooks/use-toast';

interface SwipeableCardProps {
  card: FlashCard;
  onSwipe: (direction: 'left' | 'right') => void;
  isActive: boolean;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  card,
  onSwipe,
  isActive,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
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

  // Touch/Mouse event handlers
  const handleStart = (clientX: number, clientY: number) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive) return;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);

    const threshold = 100; // Minimum distance to trigger swipe
    const rotation = dragOffset.x * 0.1; // Rotation based on drag distance

    if (Math.abs(dragOffset.x) > threshold) {
      // Trigger swipe
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      onSwipe(direction);
    } else {
      // Reset position
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global mouse/touch listeners
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX, e.clientY);
      };

      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      const handleGlobalTouchMove = (e: TouchEvent) => {
        e.preventDefault();
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
      };

      const handleGlobalTouchEnd = () => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.addEventListener('touchmove', handleGlobalTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleGlobalTouchEnd);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
        document.removeEventListener('touchmove', handleGlobalTouchMove);
        document.removeEventListener('touchend', handleGlobalTouchEnd);
      };
    }
  }, [isDragging, startPos, isActive]);

  // Calculate transform styles
  const getTransformStyle = () => {
    const rotation = dragOffset.x * 0.1;
    const scale = isDragging ? 1.05 : 1;
    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    };
  };

  // Calculate opacity for swipe indicators
  const getSwipeIndicatorOpacity = (direction: 'left' | 'right') => {
    if (!isDragging) return 0;
    const opacity = Math.abs(dragOffset.x) / 100;
    const isCorrectDirection =
      (direction === 'right' && dragOffset.x > 0) ||
      (direction === 'left' && dragOffset.x < 0);
    return isCorrectDirection ? Math.min(opacity, 1) : 0;
  };

  return (
    <div
      ref={cardRef}
      className="w-full h-full transition-all duration-300"
      style={getTransformStyle()}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Swipe Indicators */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Right Swipe Indicator - Easy to Remember */}
        <div
          className="absolute top-4 right-4 text-green-500 transition-opacity duration-200"
          style={{ opacity: getSwipeIndicatorOpacity('right') }}
        >
          <div className="flex flex-col items-center gap-1">
            <CheckIcon className="w-8 h-8" />
            <span className="text-xs font-medium bg-green-500/20 px-2 py-1 rounded-full">
              Easy
            </span>
          </div>
        </div>

        {/* Left Swipe Indicator - Hard to Remember */}
        <div
          className="absolute top-4 left-4 text-red-500 transition-opacity duration-200"
          style={{ opacity: getSwipeIndicatorOpacity('left') }}
        >
          <div className="flex flex-col items-center gap-1">
            <XIcon className="w-8 h-8" />
            <span className="text-xs font-medium bg-red-500/20 px-2 py-1 rounded-full">
              Hard
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <Card
        className={`w-full h-full cursor-grab active:cursor-grabbing ${
          isDragging ? 'shadow-2xl' : 'shadow-lg'
        }`}
        onClick={handleFlip}
      >
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
              </div>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  );
};
