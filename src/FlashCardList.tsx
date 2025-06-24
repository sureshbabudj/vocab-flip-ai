import React from "react";
import { useFlashCardStore } from "./store/flashCardStore";
import FlashCardComponent from "./FlashCard";

const FlashCardList: React.FC = () => {
  const cards = useFlashCardStore((s) => s.cards);

  if (cards.length === 0) {
    return (
      <div className="text-gray-500 text-center mt-8">
        No flash cards yet. Add a word to get started!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
      {cards.map((card) => (
        <FlashCardComponent key={card.id} card={card} />
      ))}
    </div>
  );
};

export default FlashCardList;
