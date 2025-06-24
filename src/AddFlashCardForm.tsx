import React, { useState } from "react";
import { useFlashCardStore } from "./flashCardStore";
import { chatCompletion, getEngine, isEngineLoaded } from "./webllmUtil";

import { Type, Static } from "@sinclair/typebox";

import { TypeCompiler } from "@sinclair/typebox/compiler";

const MODEL_NAME = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

const TranslationSchema = Type.Object({
  translation: Type.String(),
  example: Type.Object({
    german: Type.String(),
    english: Type.String(),
  }),
  verbForms: Type.Array(Type.String()),
  otherTranslations: Type.Array(Type.String()),
  synonyms: Type.Array(Type.String()),
});

const validator = TypeCompiler.Compile(TranslationSchema);

export type Translation = Static<typeof TranslationSchema>;

export function getMockTranslation(germanText: string): Translation {
  return {
    translation: "mock translation for: " + germanText,
    example: {
      german: "Dies ist ein Beispielsatz.",
      english: "This is an example sentence.",
    },
    verbForms:
      germanText === "gehen" ? ["gehen", "ging", "gegangen", "geht"] : [],
    otherTranslations: ["mock alt 1", "mock alt 2"],
    synonyms: ["mock synonym 1", "mock synonym 2"],
  };
}

const AddFlashCardForm: React.FC = () => {
  const addCard = useFlashCardStore((s) => s.addCard);
  const [german, setGerman] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [modelLoading, setModelLoading] = useState(false);
  const [modelStatus, setModelStatus] = useState<string>("");

  const generateTranslation = async (
    text: string
  ): Promise<Translation | null> => {
    try {
      const schema2 = JSON.stringify(TranslationSchema);
      const request = {
        stream: false,
        messages: [
          {
            role: "user",
            content: `Translate the following German text to English and provide additional linguistic information. Respond only with a JSON object containing the following keys:\n- \"translation\": the main English translation of the German text.\n- \"example\": an object with \"german\" and \"english\" keys for an example sentence relevant to the input.\n- \"verbForms\": an array of strings with different verb forms if the input is a verb.\n- \"otherTranslations\": an array of strings for alternative or contextual translations.\n- \"synonyms\": an array of strings for synonyms of the translated word/concept.\nGerman text: \"${text}\"`,
          },
        ],
        max_tokens: 128,
        response_format: {
          type: "json_object",
          schema: schema2,
        } as any,
      };
      const reply = await chatCompletion(request);
      if (reply === null || typeof reply === "string") {
        throw "❌ No reply received from the model or reply is a string";
      } else if (
        !reply.choices ||
        !Array.isArray(reply.choices) ||
        reply.choices.length === 0
      ) {
        throw "❌ Invalid reply format: " + JSON.stringify(reply);
      } else if (
        !reply.choices[0].message ||
        typeof reply.choices[0].message === "string"
      ) {
        throw "❌ No message in reply choices";
      } else if (!reply.choices[0].message.content) {
        throw "❌ No content in reply message";
      }
      const msg = JSON.parse(reply.choices[0].message.content);
      if (validator.Check(msg)) {
        return msg as Translation;
      } else {
        for (const error of validator.Errors(reply)) {
          console.error(error);
        }
        throw "❌ Validation failed for the reply: " + JSON.stringify(reply);
      }
    } catch (error) {
      console.error("❌ Error during translation:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!german.trim()) {
      setError("Please enter a German word or phrase.");
      return;
    }
    setLoading(true);
    try {
      if (!isEngineLoaded()) {
        setModelLoading(true);
        await getEngine(MODEL_NAME, (report) => setModelStatus(report.text));
        setModelLoading(false);
      }
      const msg = await generateTranslation(german);
      if (!msg) {
        setError("Failed to fetch translation.");
        return;
      }
      addCard({
        german: german.trim(),
        translation: msg.translation || "",
        details: msg,
      });
      setGerman("");
    } catch (err: any) {
      setError("Failed to fetch translation: " + (err?.message || err));
    } finally {
      setLoading(false);
      setModelLoading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-center gap-4 mt-8 mb-4"
      >
        <input
          type="text"
          value={german}
          onChange={(e) => setGerman(e.target.value)}
          placeholder="Enter German word or phrase"
          className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
        {error && (
          <div className="text-red-600 text-sm mt-2 w-full">{error}</div>
        )}
      </form>

      {modelLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white shadow rounded-lg p-8 flex flex-col items-center relative min-w-[320px] max-w-[90vw]">
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
            <div className="text-gray-600 text-sm text-center whitespace-pre-line max-h-40 overflow-y-auto">
              {modelStatus || "Initializing..."}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddFlashCardForm;
