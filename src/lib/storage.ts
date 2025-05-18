// Types for our data
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
}

export interface LogEntry {
  id: string;
  itemId: string;
  timestamp: number;
  purchaseId: string;
}

// Storage keys
const INVENTORY_KEY = 'inventory_items';
const LOGS_KEY = 'log_entries';
const CURRENT_PURCHASE_KEY = 'current_purchase_id';

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Get all inventory items
export const getInventoryItems = (): InventoryItem[] => {
  const items = localStorage.getItem(INVENTORY_KEY);
  return items ? JSON.parse(items) : [];
};

// Save inventory items
export const saveInventoryItems = (items: InventoryItem[]) => {
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
};

// Add a new inventory item
export const addInventoryItem = (name: string, category: string = 'Uncategorized'): InventoryItem => {
  const items = getInventoryItems();
  const newItem = {
    id: crypto.randomUUID(),
    name,
    category,
    quantity: 0,
  };
  items.push(newItem);
  saveInventoryItems(items);
  return newItem;
};

// Delete an inventory item
export const deleteInventoryItem = (id: string): void => {
  const items = getInventoryItems();
  const filteredItems = items.filter(item => item.id !== id);
  saveInventoryItems(filteredItems);
};

// Update an inventory item
export const updateInventoryItem = (id: string, updates: Partial<InventoryItem>): boolean => {
  const items = getInventoryItems();
  const index = items.findIndex(item => item.id === id);
  if (index === -1) return false;

  items[index] = { ...items[index], ...updates };
  saveInventoryItems(items);
  return true;
};

// Get all log entries
export const getLogEntries = (): LogEntry[] => {
  const entries = localStorage.getItem(LOGS_KEY);
  return entries ? JSON.parse(entries) : [];
};

// Save log entries
export const saveLogEntries = (entries: LogEntry[]) => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(entries));
};

// Add a new log entry
export const addLogEntry = (itemId: string) => {
  const entries = getLogEntries();
  const purchaseId = getCurrentPurchaseId();

  const newEntry: LogEntry = {
    id: generateId(),
    itemId,
    timestamp: Date.now(),
    purchaseId
  };

  entries.push(newEntry);
  saveLogEntries(entries);
};

// Delete a log entry
export const deleteLogEntry = (id: string) => {
  const entries = getLogEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  saveLogEntries(filteredEntries);
};

// Get current purchase ID
export const getCurrentPurchaseId = (): string => {
  const purchaseId = localStorage.getItem(CURRENT_PURCHASE_KEY);
  return purchaseId || generateId();
};

// Start a new purchase
export const startNewPurchase = (): string => {
  const newPurchaseId = generateId();
  localStorage.setItem(CURRENT_PURCHASE_KEY, newPurchaseId);
  return newPurchaseId;
};

// Clear all log entries
export const clearLogEntries = () => {
  localStorage.removeItem(LOGS_KEY);
  localStorage.removeItem(CURRENT_PURCHASE_KEY);
};

// Get all unique categories
export const getCategories = (): string[] => {
  const items = getInventoryItems();
  const categories = new Set(items.map(item => item.category || 'Uncategorized'));
  return Array.from(categories);
};

// Import inventory from CSV
export const importInventoryFromCSV = (csvData: string): void => {
  const lines = csvData.split('\n');
  if (lines.length < 2) return; // Need at least header and one data row

  const headers = lines[0].toLowerCase().split(',');
  const nameIndex = headers.findIndex(h => h.includes('name'));
  const categoryIndex = headers.findIndex(h => h.includes('category'));

  if (nameIndex === -1) return; // Need at least name

  const items = getInventoryItems();

  // Process each line starting from index 1 (skip header)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split by comma, but respect quoted values
    const values = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    // Clean up quoted values
    const cleanValues = values.map(v => v.replace(/^"(.*)"$/, '$1').trim());

    const name = cleanValues[nameIndex];
    const category = categoryIndex !== -1 ? cleanValues[categoryIndex] : 'Uncategorized';

    if (name) {
      items.push({
        id: crypto.randomUUID(),
        name,
        category: category || 'Uncategorized',
        quantity: 0,
      });
    }
  }

  saveInventoryItems(items);
}; 