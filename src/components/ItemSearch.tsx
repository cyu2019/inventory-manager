import { useState, useRef, useEffect } from 'react';
import type { InventoryItem } from '../lib/storage';

interface ItemSearchProps {
  items: InventoryItem[];
  onItemSelect: (itemId: string) => void;
}

export function ItemSearch({ items, onItemSelect }: ItemSearchProps) {
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<InventoryItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const findClosestMatches = (input: string) => {
    if (!input.trim()) return [];

    const matches = items
      .map(item => ({
        item,
        score: calculateSimilarity(
          (item.name + ' ' + item.category).toLowerCase(),
          input.toLowerCase()
        )
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(match => match.item);

    return matches;
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    let score = 0;
    const len = Math.min(str1.length, str2.length);

    for (let i = 0; i < len; i++) {
      if (str1.includes(str2.substring(0, i + 1))) {
        score++;
      }
    }

    return score;
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (searchText && suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    const newSuggestions = findClosestMatches(value);
    setSuggestions(newSuggestions);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (item: InventoryItem) => {
    onItemSelect(item.id);
    setSearchText('');
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  return (
    <div ref={searchRef} className="relative">
      <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
        Search Item
      </label>
      <input
        type="text"
        id="search"
        value={searchText}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
        placeholder="Type item name and press Enter..."
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 text-lg"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {suggestions.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSuggestionClick(item)}
              className={`block w-full text-left px-4 py-3 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 text-lg ${index === selectedIndex ? 'bg-gray-100' : ''
                }`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="block text-lg">{item.name}</span>
              <span className="block text-sm text-gray-500">{item.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 