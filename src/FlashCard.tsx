import React from 'react';
import { type FlashCard, useFlashCardStore } from './store/flashCardStore';
import { Trash2Icon } from 'lucide-react';
import { Button } from './components/ui/button';
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
} from './components/ui/alert-dialog';
import { Card } from './components/ui/card';
import { useToast } from './hooks/use-toast';

interface Props {
  card: FlashCard;
}

const FlashCardComponent: React.FC<Props> = ({ card }) => {
  const revealCard = useFlashCardStore((s) => s.revealCard);
  const hideCard = useFlashCardStore((s) => s.hideCard);
  const removeCard = useFlashCardStore((s) => s.removeCard);
  const { toast } = useToast();

  const handleFlip = () => {
    card.revealed ? hideCard(card.id) : revealCard(card.id);
  };

  const handleDelete = () => {
    removeCard(card.id);
    toast({
      title: 'Card deleted',
      description: `Removed "${card.german}" from your flashcards.`,
      variant: 'default',
    });
  };

  return (
    <div
      className="perspective w-full min-h-72 relative mb-6"
      tabIndex={0}
      role="button"
      aria-pressed={card.revealed}
      onClick={handleFlip}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleFlip()}
      style={{ minHeight: '18rem', maxHeight: '28rem' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${card.revealed ? 'rotate-y-180' : ''}`}
        style={{ minHeight: '18rem', maxHeight: '28rem' }}
      >
        {/* Front */}
        <Card
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-accent to-background/80 text-card-foreground border-3 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 p-6"
          style={{ minHeight: '18rem', maxHeight: '28rem' }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {/* Primary Content - Main Focal Point */}
            <div className="text-center space-y-4">
              <div className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                {card.german}
              </div>
              <div className="text-muted-foreground text-base font-medium">
                Tap to reveal translation
              </div>
            </div>
          </div>

          {/* Delete button - Secondary Action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 z-10 w-8 h-8 text-destructive border-2 border-destructive/50 rounded-full hover:bg-destructive/10"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
                aria-label="Delete card"
              >
                <Trash2Icon className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="min-w-72">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  card "{card.german}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter onClick={(e) => e.stopPropagation()}>
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
          className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-card to-card/80 text-card-foreground border-3 border-primary/20 shadow-xl p-6 overflow-y-auto"
          style={{ minHeight: '18rem', maxHeight: '28rem' }}
        >
          <div className="flex flex-col h-full">
            {/* Translation Section - Primary Focal Point */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 mb-6">
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-center leading-tight">
                {card.translation}
              </div>
              <div className="text-muted-foreground text-base font-medium">
                Tap to hide
              </div>
            </div>

            {/* Card Details - Secondary Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="w-full flex flex-col gap-6">
                {card.details?.example && (
                  <div className="flex flex-col space-y-2 text-base">
                    <div className="t uppercase font-bold text-primary mb-2 tracking-wider">
                      Example
                    </div>
                    <span className="text-primary font-semibold">German:</span>
                    <blockquote className="border-l-4 border-primary pl-2 italic bg-muted/30">
                      {card.details.example.original}
                    </blockquote>
                    <span className="text-primary font-semibold">English:</span>
                    <blockquote className="border-l-4 border-primary pl-2 italic bg-muted/30">
                      {card.details.example.translated}
                    </blockquote>
                  </div>
                )}
                {card.details?.verbForms?.length > 0 && (
                  <div className="">
                    <div className="text-xs uppercase font-bold  mb-2 tracking-wider">
                      Verb Forms
                    </div>
                    <div className="text-sm text-foreground font-medium">
                      {card.details.verbForms.join(', ')}
                    </div>
                  </div>
                )}
                {card.details?.otherTranslations?.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <div className="text-xs uppercase font-bold text-accent mb-2 tracking-wider">
                      Other Translations
                    </div>
                    <div className="text-sm text-foreground font-medium">
                      {card.details.otherTranslations.join(', ')}
                    </div>
                  </div>
                )}
                {card.details?.synonyms?.length > 0 && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <div className="text-xs uppercase font-bold text-accent mb-2 tracking-wider">
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
  );
};

export default FlashCardComponent;

// Tailwind CSS for flip effect
// .perspective { perspective: 1000px; }
// .backface-hidden { backface-visibility: hidden; }
// .rotate-y-180 { transform: rotateY(180deg); }
// .transform-style-preserve-3d { transform-style: preserve-3d; }
