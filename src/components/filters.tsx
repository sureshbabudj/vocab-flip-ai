import { useState } from 'react';
import { useFlashCardStore } from '../store/flashCardStore';
import { X, FilterIcon, SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';

export function SortBy() {
  const sortBy = useFlashCardStore((state) => state.sortBy);
  const setSortBy = useFlashCardStore((state) => state.setSortBy);

  return (
    <div className="flex flex-col gap-1">
      <Label className="text-sm font-semibold text-foreground">Sort by:</Label>
      <Select value={sortBy} onValueChange={setSortBy} name="sortBy">
        <SelectTrigger id="sortBy">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All cards</SelectItem>
          <SelectItem value="a-z">Alphabetically A to Z</SelectItem>
          <SelectItem value="z-a">Alphabetically Z to A</SelectItem>
          <SelectItem value="recent">Recently added</SelectItem>
          <SelectItem value="oldest">First added</SelectItem>
        </SelectContent>
      </Select>
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
      <Label className="text-sm font-semibold text-foreground">
        Search by word:
      </Label>
      <div className="flex flex-row gap-2 items-stretch">
        <Input
          type="text"
          startIcon={SearchIcon}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search cards..."
          className="flex-1 text-sm"
        />
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="max-w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All fields</SelectItem>
            <SelectItem value="german">German word</SelectItem>
            <SelectItem value="translation">Translation</SelectItem>
          </SelectContent>
        </Select>
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
    <>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-foreground">
          Filter by letter:
        </Label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={currentLetter === 'all' ? 'default' : 'outline'}
            onClick={() => setCurrentLetter('all')}
            size="sm"
            className="h-10 px-4 font-medium border-2 transition-all duration-200 hover:scale-105"
          >
            All
          </Button>
          {letters.map((letter) => (
            <Button
              key={letter}
              variant={currentLetter === letter ? 'default' : 'outline'}
              onClick={() => setCurrentLetter(letter)}
              size="sm"
              className="h-10 w-10 font-bold border-2 transition-all duration-200 hover:scale-105"
            >
              {letter}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-semibold text-foreground">
          Sort by letter:
        </Label>
        <div className="flex flex-row gap-2">
          <Button
            variant={sortDirection === 'a-z' ? 'default' : 'outline'}
            onClick={() => setSortDirection('a-z')}
            size="sm"
            className="h-10 px-4 font-medium border-2 transition-all duration-200 hover:scale-105"
          >
            A → Z
          </Button>
          <Button
            variant={sortDirection === 'z-a' ? 'default' : 'outline'}
            onClick={() => setSortDirection('z-a')}
            size="sm"
            className="h-10 px-4 font-medium border-2 transition-all duration-200 hover:scale-105"
          >
            Z → A
          </Button>
        </div>
      </div>
    </>
  );
}

// Advanced filters modal
function AdvancedFiltersModal() {
  return (
    <DialogContent className="max-w-md">
      <div className="flex flex-col space-y-6">
        <SortBy />
        <Search />
        <PaginationByAlphabet />
      </div>
    </DialogContent>
  );
}

// Combined filters component that can be used in the main app
export function Filters({ children }: React.PropsWithChildren) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <>
      <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <AdvancedFiltersModal />
      </Dialog>
    </>
  );
}
