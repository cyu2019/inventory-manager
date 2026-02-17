import { useState, useRef, useEffect } from 'react';
import type { InventoryItem } from '../lib/storage';
import { useItems } from '../contexts/ItemsContext';
import { useLogs } from '../contexts/LogsContext';
import { TouchButton } from './TouchButton';

export function ItemSearch() {
  const { items } = useItems();
  const { addLog: onItemSelect } = useLogs();
  const [searchText, setSearchText] = useState('');
  const [suggestions, setSuggestions] = useState<InventoryItem[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
        setSearchText("")
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
      case 'Enter':
        e.preventDefault();
        if (searchText && suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    const newSuggestions = findClosestMatches(value);
    setSuggestions(newSuggestions);
  };

  const handleSuggestionClick = (item: InventoryItem) => {
    // clear box but don't delete suggestions
    setSearchText('');

    onItemSelect(item.id);
  };

  return (
    <div ref={searchRef} className="relative">
      <input
        type="text"
        id="search"
        value={searchText}
        onChange={handleSearchChange}
        onKeyDown={handleSearchKeyDown}
        placeholder="Type item name..."
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 py-3 text-3xl"
      />
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
          {suggestions.map((item) => (
            <TouchButton
              key={item.id}
              onClick={() => handleSuggestionClick(item)}
              className={`block w-full text-left p-3 text-lg`}
            >
              <div className='w-full'>
                <span className="block text-3xl">{item.name}</span>
                <span className="block text-lg text-gray-500">{item.category}</span>
              </div>
            </TouchButton>
          ))}
        </div>
      )}

    </div>
  );
} 