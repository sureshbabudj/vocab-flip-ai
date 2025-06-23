import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FlashCard {
  id: string;
  german: string;
  translation: string;
  details: any;
  revealed: boolean;
}

interface FlashCardState {
  cards: FlashCard[];
  addCard: (card: Omit<FlashCard, "id" | "revealed">) => void;
  revealCard: (id: string) => void;
  hideCard: (id: string) => void;
  removeCard: (id: string) => void;
}

export const useFlashCardStore = create<FlashCardState>()(
  persist(
    (set, get) => ({
      cards: [],
      addCard: (card) =>
        set((state) => ({
          cards: [
            ...state.cards,
            {
              ...card,
              id: Math.random().toString(36).slice(2),
              revealed: false,
            },
          ],
        })),
      revealCard: (id) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, revealed: true } : c
          ),
        })),
      hideCard: (id) =>
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, revealed: false } : c
          ),
        })),
      removeCard: (id) =>
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        })),
    }),
    {
      name: "flash-card-storage",
    }
  )
);
