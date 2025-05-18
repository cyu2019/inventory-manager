import { useState } from 'react';
import InventoryPage from './pages/Inventory';
import LogPage from './pages/Log';
import QuickLogPage from './pages/QuickLog';
import Header from './components/Header';
import { ItemsProvider } from './contexts/ItemsContext';
import { LogsProvider } from './contexts/LogsContext';

function App() {
  const [currentPage, setCurrentPage] = useState<'inventory' | 'log' | 'quick-log'>('inventory');

  return (
    <div className="min-h-screen">
      <ItemsProvider>
        <LogsProvider>
          <Header currentPage={currentPage} onPageChange={setCurrentPage} />
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
