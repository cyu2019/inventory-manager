import { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string;
  type?: 'text' | 'number' | 'select';
  options?: string[];
  onSave: (value: string) => void;
}

export default function EditableCell({ value, type = 'text', options = [], onSave }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString());
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    onSave(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value?.toString());
    }
  };

  if (!isEditing) {
    return (
      <div
        className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
        onClick={() => setIsEditing(true)}
      >
        {type === 'number' ? `$${Number(value).toFixed(2)}` : value}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <select
        ref={inputRef as React.RefObject<HTMLSelectElement>}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={type}
      value={editValue}
      step={type === 'number' ? '0.01' : undefined}
      onChange={(e) => setEditValue(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  );
} 