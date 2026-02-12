import { createContext, useContext, type ReactNode, useState } from 'react';
import type { InventoryItem, LogEntry } from '../lib/storage';
import {
  getLogEntries,
  addLogEntry,
  deleteLogEntry,
  getCurrentPurchaseId,
  startNewPurchase,
  clearLogEntries,
  getInventoryItems
} from '../lib/storage';

export interface EnrichedLogEntry extends LogEntry {
  itemName: string;
  category: string;
}

const getEnrichedLogs = (): EnrichedLogEntry[] => {
  const logEntries = getLogEntries();
  const inventoryItems = getInventoryItems();

  const enrichedLogs = logEntries.map((log: LogEntry) => {
    const item = inventoryItems.find((i: InventoryItem) => i.id === log.itemId);
    return {
      ...log,
      itemName: item?.name || 'Unknown Item',
      category: item?.category || 'Uncategorized'
    };
  });

  enrichedLogs.sort((a: EnrichedLogEntry, b: EnrichedLogEntry) => b.timestamp - a.timestamp);
  return enrichedLogs;
};

interface LogsContextType {
  logs: EnrichedLogEntry[];
  currentPurchaseId: string;
  addLog: (itemId: string) => void;
  deleteLog: (id: string) => void;
  completePurchase: () => void;
  resumePurchase: (id: string) => void;
  clearLogs: () => void;
  downloadCSV: () => void;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<EnrichedLogEntry[]>(getEnrichedLogs());
  const [currentPurchaseId, setCurrentPurchaseId] = useState(getCurrentPurchaseId());

  const addLog = (itemId: string) => {
    addLogEntry(itemId);
    setLogs(getEnrichedLogs());
  };

  const deleteLog = (id: string) => {
    deleteLogEntry(id);
    setLogs(getEnrichedLogs());
  };

  const completePurchase = () => {
    setCurrentPurchaseId(startNewPurchase());
    setLogs(getEnrichedLogs());
  };

  const resumePurchase = (purchaseId: string) => {
    setCurrentPurchaseId(purchaseId);
  };

  const clearLogs = () => {
    if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
      clearLogEntries();
      setLogs([]);
    }
  };

  const downloadCSV = () => {
    const headers = ['Purchase ID', 'Time', 'Item Name', 'Category'];
    const rows = logs.map(log => [
      log.purchaseId,
      new Date(log.timestamp).toLocaleString(),
      log.itemName,
      log.category
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_log_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const value = {
    logs,
    currentPurchaseId,
    addLog,
    deleteLog,
    completePurchase,
    clearLogs,
    downloadCSV,
    resumePurchase
  };

  return <LogsContext.Provider value={value}>{children}</LogsContext.Provider>;
}

export function useLogs() {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogsContext must be used within a LogsProvider');
  }
  return context;
} 