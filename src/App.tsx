import { useState } from 'react';
import InventoryPage from './pages/Inventory';
import LogPage from './pages/Log';
import QuickLogPage from './pages/QuickLog';
import { ItemsProvider } from './contexts/ItemsContext';
import { LogsProvider } from './contexts/LogsContext';
import { TouchButton } from './components/TouchButton';
import clsx from 'clsx';

const PAGES = ['inventory', 'log', 'quick-log']

function App() {
  const [currentPage, setCurrentPage] = useState('inventory');

  return (
    <div className="min-h-screen">
      <ItemsProvider>
        <LogsProvider>
          <header className="flex items-center justify-center gap-3">
            {PAGES.map(e => (
              <TouchButton
                onClick={() => setCurrentPage(e)}
                className={clsx(
                  "flex-1",
                  currentPage === e
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >{e}</TouchButton>
            ))}

          </header>
          <main className="container mx-auto py-4">
            {currentPage === 'inventory' ? (
              <InventoryPage />
            ) : currentPage === 'log' ? (
              <LogPage />
            ) : (
              <QuickLogPage />
            )}
          </main>
        </LogsProvider>
      </ItemsProvider>
    </div>
  );
}

export default App;
