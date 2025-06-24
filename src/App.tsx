import React from "react";

import AddFlashCardForm from "./AddFlashCardForm";
import FlashCardList from "./FlashCardList";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          VocabFlip AI
        </h1>
        <AddFlashCardForm />
        <FlashCardList />
      </div>
    </div>
  );
};

export default App;
