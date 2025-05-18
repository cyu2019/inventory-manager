import { useState, useRef } from 'react';
import EditableCell from '../components/EditableCell';
import {
  importInventoryFromCSV
} from '../lib/storage';
import { useItems } from '../contexts/ItemsContext';

type SortField = 'name' | 'category';
type SortDirection = 'asc' | 'desc';

export default function InventoryPage() {
  const [newItem, setNewItem] = useState({ name: '', category: '' });
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    items,
    categories,
    addItem,
    deleteItem,
    duplicateItem,
    updateItem,
  } = useItems();

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedItems = () => {
    const filteredItems = selectedCategory === 'all'
      ? items
      : items.filter(item => item.category === selectedCategory);

    return filteredItems.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue.localeCompare(bValue) * direction;
    });
  };

  const downloadCSV = () => {
    const headers = ['Name', 'Category'];
    const rows = items.map(item => [
      item.name,
      item.category
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        if (confirm('Are you sure you want to import this CSV? This will add new items to your inventory.')) {
          importInventoryFromCSV(text);
          // Force a refresh of the items and categories
          window.location.reload();
        }
      }
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    // Use selected category if new item category is empty
    const category = newItem.category || (selectedCategory !== 'all' ? selectedCategory : 'Uncategorized');
    addItem(newItem.name, category);
    setNewItem({ name: '', category: '' });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <span className="ml-1">
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="space-x-2">
          <button
            onClick={downloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={handleImportClick}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Import CSV
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>

      <form onSubmit={handleAddItem} className="flex gap-4 items-end">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            value={newItem.name}
            onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            value={newItem.category}
            onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
            placeholder={selectedCategory !== 'all' ? selectedCategory : 'Uncategorized'}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Item
        </button>
      </form>

      <div className="flex justify-between items-center">
        <div>
          <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700">Filter by Category</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon field="name" />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category <SortIcon field="category" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {getSortedItems().map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableCell
                    value={item.name}
                    onSave={(value) => updateItem(item.id, 'name', value)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <EditableCell
                    value={item.category}
                    type="select"
                    options={[...categories, 'New Category']}
                    onSave={(value) => {
                      if (value === 'New Category') {
                        const newCategory = prompt('Enter new category name:');
                        if (newCategory) {
                          updateItem(item.id, 'category', newCategory);
                        }
                      } else {
                        updateItem(item.id, 'category', value);
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => duplicateItem(item)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 