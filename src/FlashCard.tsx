import React from "react";
import { FlashCard, useFlashCardStore } from "./flashCardStore";

interface Props {
  card: FlashCard;
}

const FlashCardComponent: React.FC<Props> = ({ card }) => {
  const revealCard = useFlashCardStore((s) => s.revealCard);
  const hideCard = useFlashCardStore((s) => s.hideCard);
  const removeCard = useFlashCardStore((s) => s.removeCard);

  const handleFlip = () => {
    card.revealed ? hideCard(card.id) : revealCard(card.id);
  };

  return (
    <div
      className="perspective w-full min-h-64 relative"
      tabIndex={0}
      role="button"
      aria-pressed={card.revealed}
      onClick={handleFlip}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleFlip()}
      style={{ minHeight: "16rem", maxHeight: "24rem" }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${card.revealed ? "rotate-y-180" : ""}`}
        style={{ minHeight: "16rem", maxHeight: "24rem" }}
      >
        {/* Front */}
        <div
          className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow flex flex-col items-center justify-center border-2 border-blue-300 p-4"
          style={{ minHeight: "16rem", maxHeight: "24rem" }}
        >
          <button
            className="absolute top-2 right-2 z-10 w-7 h-7 flex items-center justify-center bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition text-base font-bold"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm("Delete this card?")) removeCard(card.id);
            }}
            tabIndex={-1}
            aria-label="Delete card"
          >
            ×
          </button>
          <div className="text-2xl font-bold text-blue-800 mb-2">
            {card.german}
          </div>
          <div className="text-gray-500 text-sm">Click to reveal</div>
        </div>
        {/* Back */}
        <div
          className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow border-2 border-blue-600 p-4 flex flex-col items-start justify-start rotate-y-180 overflow-y-auto"
          style={{
            minHeight: "16rem",
            maxHeight: "24rem",
            paddingTop: "1.5rem",
          }}
        >
          <div className="mb-2">
            <span className="block text-xs uppercase text-blue-400 font-semibold mb-1">
              Translation
            </span>
            <span className="text-lg font-bold text-blue-700">
              {card.translation}
            </span>
          </div>
          {card.details?.example && (
            <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-700 bg-blue-50 rounded mb-2">
              <div className="text-xs text-blue-400 font-semibold mb-1">
                Example
              </div>
              <div className="font-mono text-sm text-blue-900">
                German: {card.details.example.german}
              </div>
              <div className="font-mono text-sm text-blue-900">
                English: {card.details.example.english}
              </div>
            </blockquote>
          )}
          {card.details?.verbForms?.length > 0 && (
            <div className="mb-1">
              <span className="block text-xs uppercase text-blue-400 font-semibold mb-1">
                Verb Forms
              </span>
              <span className="text-sm text-gray-700">
                {card.details.verbForms.join(", ")}
              </span>
            </div>
          )}
          {card.details?.otherTranslations?.length > 0 && (
            <div className="mb-1">
              <span className="block text-xs uppercase text-blue-400 font-semibold mb-1">
                Other Translations
              </span>
              <span className="text-sm text-gray-700">
                {card.details.otherTranslations.join(", ")}
              </span>
            </div>
          )}
          {card.details?.synonyms?.length > 0 && (
            <div className="mb-1">
              <span className="block text-xs uppercase text-blue-400 font-semibold mb-1">
                Synonyms
              </span>
              <span className="text-sm text-gray-700">
                {card.details.synonyms.join(", ")}
              </span>
            </div>
          )}
        </div>
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
