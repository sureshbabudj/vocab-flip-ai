import { useState } from 'react';
import { useFlashCardStore } from '../store/flashCardStore';
import { X } from 'lucide-react';

export function SortBy() {
  const sortBy = useFlashCardStore((state) => state.sortBy);
  const setSortBy = useFlashCardStore((state) => state.setSortBy);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="sortBy"
        id="sortByLabel"
        className="text-xs font-medium text-gray-700"
      >
        Sort by:
      </label>
      <select
        name="sortBy"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">All cards</option>
        <option value="a-z">Alphabetically A to Z</option>
        <option value="z-a">Alphabetically Z to A</option>
        <option value="recent">Recently added</option>
        <option value="oldest">First added</option>
      </select>
    </div>
  );
}

export function Search() {
  const searchTerm = useFlashCardStore((state) => state.searchTerm);
  const searchField = useFlashCardStore((state) => state.searchField);
  const setSearchTerm = useFlashCardStore((state) => state.setSearchTerm);
  const setSearchField = useFlashCardStore((state) => state.setSearchField);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Search:</label>
      <div className="flex flex-row gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cards..."
          className="w-1/2 sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value as any)}
          className="w-1/2 sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All fields</option>
          <option value="german">German word</option>
          <option value="translation">Translation</option>
        </select>
      </div>
    </div>
  );
}

export function PaginationByAlphabet() {
  const cards = useFlashCardStore((state) => state.cards);
  const currentLetter = useFlashCardStore((state) => state.currentLetter);
  const sortDirection = useFlashCardStore((state) => state.sortDirection);
  const setCurrentLetter = useFlashCardStore((state) => state.setCurrentLetter);
  const setSortDirection = useFlashCardStore((state) => state.setSortDirection);

  // Get all unique first letters
  const letters = Array.from(
    new Set(cards.map((card) => card.german.charAt(0).toUpperCase())),
  ).sort();

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Filter by letter:
      </label>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => setCurrentLetter('all')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            currentLetter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        {letters.map((letter) => (
          <button
            key={letter}
            onClick={() => setCurrentLetter(letter)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              currentLetter === letter
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setSortDirection('a-z')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            sortDirection === 'a-z'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          A → Z
        </button>
        <button
          onClick={() => setSortDirection('z-a')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
            sortDirection === 'z-a'
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Z → A
        </button>
      </div>
    </div>
  );
}

// Advanced filters modal
function AdvancedFiltersModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Advanced Filters
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-6">
          <Search />
          <PaginationByAlphabet />
        </div>
      </div>
    </div>
  );
}

// Combined filters component that can be used in the main app
export function Filters() {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <>
      <div className="bg-white py-3 px-2 rounded-lg shadow-sm border border-gray-200 mb-3">
        <div className="flex flex-row items-end justify-between gap-2">
          <div className="flex-1 max-w-xs">
            <SortBy />
          </div>
          <button
            onClick={() => setIsAdvancedOpen(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-sm font-medium"
          >
            Advanced
          </button>
        </div>
      </div>

      <AdvancedFiltersModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
      />
    </>
  );
}
