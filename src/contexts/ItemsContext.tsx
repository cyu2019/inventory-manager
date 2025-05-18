import { createContext, useContext, type ReactNode, useState } from 'react';
import type { InventoryItem } from '../lib/storage';
import {
  getInventoryItems,
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
  getCategories
} from '../lib/storage';

interface ItemsContextType {
  items: InventoryItem[];
  categories: string[];
  addItem: (name: string, category: string) => void;
  deleteItem: (id: string) => void;
  duplicateItem: (item: InventoryItem) => void;
  updateItem: (id: string, field: keyof InventoryItem, value: string) => void;
}

const ItemsContext = createContext<ItemsContextType | undefined>(undefined);

export function ItemsProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(getInventoryItems());
  const [categories, setCategories] = useState<string[]>(getCategories());

  const addItem = (name: string, category: string) => {
    if (!name) return;
    addInventoryItem(name, category);
    refreshData();
  };

  const deleteItem = (id: string) => {
    deleteInventoryItem(id);
    refreshData();
  };

  const duplicateItem = (item: InventoryItem) => {
    addInventoryItem(item.name + ' (Copy)', item.category);
    refreshData();
  };

  const updateItem = (id: string, field: keyof InventoryItem, value: string) => {
    const updated = updateInventoryItem(id, { [field]: value });
    if (updated) {
      refreshData();
    }
  };

  const refreshData = () => {
    setItems(getInventoryItems());
    setCategories(getCategories());
  };

  const value = {
    items,
    categories,
    addItem,
    deleteItem,
    duplicateItem,
    updateItem
  };

  return <ItemsContext.Provider value={value}>{children}</ItemsContext.Provider>;
}

export function useItems() {
  const context = useContext(ItemsContext);
  if (context === undefined) {
    throw new Error('useItemsContext must be used within an ItemsProvider');
  }
  return context;
} 