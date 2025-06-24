import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

  // Computed
  filteredCards: FlashCard[];
}

export const useFlashCardStore = create<FlashCardState>()(
  persist(
    (set, get) => ({
      cards: [],
      sortBy: 'all',
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

      // Computed filtered cards
      get filteredCards() {
        const {
          cards,
          sortBy,
          searchTerm,
          searchField,
          currentLetter,
          sortDirection,
        } = get();

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
      },
    }),
    {
      name: 'flash-card-storage',
    },
  ),
);
