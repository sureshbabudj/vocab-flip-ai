import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface FlashCard {
  id: string;
  german: string;
  translation: string;
  details: any;
  revealed: boolean;
  createdAt: number;
}

type SortOption = 'all' | 'a-z' | 'z-a' | 'recent' | 'oldest';
type SearchField = 'all' | 'german' | 'translation';

interface FlashCardState {
  cards: FlashCard[];
  sortBy: SortOption;
  searchTerm: string;
  searchField: SearchField;
  currentLetter: string;
  sortDirection: 'a-z' | 'z-a';

  // Actions
  addCard: (card: Omit<FlashCard, 'id' | 'revealed' | 'createdAt'>) => void;
  revealCard: (id: string) => void;
  hideCard: (id: string) => void;
  removeCard: (id: string) => void;

  // Filter actions
  setSortBy: (sortBy: SortOption) => void;
  setSearchTerm: (term: string) => void;
  setSearchField: (field: SearchField) => void;
  setCurrentLetter: (letter: string) => void;
  setSortDirection: (direction: 'a-z' | 'z-a') => void;

  // reset Search, Filers and Sort
  resetAll: () => void;

  // Import/Export actions
  importCards: (cards: FlashCard[]) => void;
  exportCards: () => FlashCard[];
}

export const useFlashCardStore = create<FlashCardState>()(
  devtools(
    persist(
      (set, get) => ({
        cards: [],
        sortBy: 'recent',
        searchTerm: '',
        searchField: 'all',
        currentLetter: 'all',
        sortDirection: 'a-z',

        addCard: (card) =>
          set((state) => ({
            cards: [
              ...state.cards,
              {
                ...card,
                id: Math.random().toString(36).slice(2),
                revealed: false,
                createdAt: Date.now(),
              },
            ],
          })),
        revealCard: (id) =>
          set((state) => ({
            cards: state.cards.map((c) =>
              c.id === id ? { ...c, revealed: true } : c,
            ),
          })),
        hideCard: (id) =>
          set((state) => ({
            cards: state.cards.map((c) =>
              c.id === id ? { ...c, revealed: false } : c,
            ),
          })),
        removeCard: (id) =>
          set((state) => ({
            cards: state.cards.filter((c) => c.id !== id),
          })),

        // Filter actions
        setSortBy: (sortBy) => set({ sortBy }),
        setSearchTerm: (searchTerm) => set({ searchTerm }),
        setSearchField: (searchField) => set({ searchField }),
        setCurrentLetter: (currentLetter) => set({ currentLetter }),
        setSortDirection: (sortDirection) => set({ sortDirection }),

        resetAll: () =>
          set({
            sortBy: 'recent',
            searchTerm: '',
            searchField: 'all',
            currentLetter: 'all',
          }),

        // Import/Export actions
        importCards: (cards) => set({ cards }),
        exportCards: () => get().cards,
      }),
      {
        name: 'flash-card-storage',
      },
    ),
  ),
);
