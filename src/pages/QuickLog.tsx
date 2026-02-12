import { useMemo, useState } from 'react';
import { CurrentPurchaseItems } from '../components/CurrentLogItems';
import { useItems } from '../contexts/ItemsContext';
import { useLogs } from '../contexts/LogsContext';
import { TouchButton } from '../components/TouchButton';

export default function QuickLogPage() {
  const { items, categories } = useItems();
  const { addLog } = useLogs();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sortedCategories = useMemo(() => [...categories].sort(), [categories]);
  const categoryItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : [];

  return (
    <div className="p-4 space-y-4">
      <CurrentPurchaseItems />
      {!selectedCategory ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {sortedCategories.map(category => (
            <TouchButton
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="bg-blue-500 text-white w-full h-full"
            >
              {category}
            </TouchButton>
          ))}
        </div>
      ) : (
        <div className='space-y-4'>
          <TouchButton
            onClick={() => setSelectedCategory(null)}
            className=" text-blue-500"
          >
            ←
          </TouchButton>
          <h2 className="text-2xl font-bold">{selectedCategory}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categoryItems.map(item => (
              <TouchButton
                key={item.id}
                onClick={() => addLog(item.id)}
                className="bg-gray-100 w-full h-full"
              >
                {item.name}
              </TouchButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 