import React, { useState, useEffect } from "react";

import { getEngine } from "./webllmUtil";

import AddFlashCardForm, { MockTranslation } from "./AddFlashCardForm";
import FlashCardList from "./FlashCardList";

const App: React.FC = () => {
  const [modelLoading, setModelLoading] = useState(true);
  const [modelStatus, setModelStatus] = useState<string>("");

  // Loader effect for first time model load
  useEffect(() => {
    let isMounted = true;
    getEngine("Llama-3.2-3B-Instruct-q4f16_1-MLC", (report) => {
      if (isMounted) setModelStatus(report.text);
    })
      .then(() => {
        if (isMounted) setModelLoading(false);
      })
      .catch((err) => {
        if (isMounted) setModelStatus("Error loading model: " + err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (modelLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            ></path>
          </svg>
          <div className="text-lg font-semibold text-blue-700 mb-2">
            Loading AI Model...
          </div>
          <div className="text-gray-600 text-sm text-center whitespace-pre-line">
            {modelStatus || "Initializing..."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          German Flash Cards
        </h1>
        <AddFlashCardForm />
        <FlashCardList />
      </div>
    </div>
  );
};

export default App;
