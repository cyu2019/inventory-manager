import { useMemo, useState } from 'react';
import { LogHeader } from '../components/LogHeader';
import { CurrentPurchaseItems } from '../components/CurrentLogItems';
import { useItems } from '../contexts/ItemsContext';
import { useLogs } from '../contexts/LogsContext';

export default function QuickLogPage() {
  const { items, categories } = useItems();
  const { addLog } = useLogs();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sortedCategories = useMemo(() => [...categories].sort(), [categories]);
  const categoryItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="p-4">
      <LogHeader />
      <CurrentPurchaseItems />
      {!selectedCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedCategories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="p-6 text-xl font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {category}
            </button>
          ))}
        </div>
      ) : (
        <div className='space-y-4 my-4'>
          <button
            onClick={() => setSelectedCategory(null)}
            className="mr-4 text-blue-500 hover:text-blue-600"
          >
            ← Back to Categories
          </button>
          <h2 className="text-2xl font-bold">{selectedCategory}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryItems.map(item => (
              <button
                key={item.id}
                onClick={() => addLog(item.id)}
                className="p-4 text-lg bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 