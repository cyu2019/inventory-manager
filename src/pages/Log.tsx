import { ItemSearch } from '../components/ItemSearch';
import { LogHeader } from '../components/LogHeader';
import { LogTable } from '../components/LogTable';
import { useItems } from '../contexts/ItemsContext';
import { useLogs } from '../contexts/LogsContext';

export default function LogPage() {
  const { items } = useItems();
  const {
    logs,
    currentPurchaseId,
    addLog,
    clearLogs,
    deleteLog,
    downloadCSV
  } = useLogs();

  return (
    <div className="space-y-4 p-4">
      <LogHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ItemSearch items={items} onItemSelect={addLog} />
      </div>

      <LogTable
        logs={logs}
        currentPurchaseId={currentPurchaseId}
        onDeleteLog={deleteLog}
        onDownloadCSV={downloadCSV}
        onClearLogs={clearLogs}
      />
    </div>
  );
} 