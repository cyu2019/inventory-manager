import type { FC } from 'react';
import clsx from 'clsx';

interface HeaderProps {
  currentPage: 'inventory' | 'log' | 'quick-log';
  onPageChange: (page: 'inventory' | 'log' | 'quick-log') => void;
}

const Header: FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Merch Inventory</h1>
            </div>
            <nav className="ml-6 flex space-x-4">
              <button
                onClick={() => onPageChange('inventory')}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  currentPage === 'inventory'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                Inventory
              </button>
              <button
                onClick={() => onPageChange('log')}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  currentPage === 'log'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                Log
              </button>
              <button
                onClick={() => onPageChange('quick-log')}
                className={clsx(
                  'px-3 py-2 rounded-md text-sm font-medium',
                  currentPage === 'quick-log'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                Quick Log
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 