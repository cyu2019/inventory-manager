interface EnrichedLogEntry {
  id: string;
  itemId: string;
  timestamp: number;
  purchaseId: string;
  itemName: string;
  category: string;
}

interface LogTableProps {
  logs: EnrichedLogEntry[];
  currentPurchaseId: string;
  onDeleteLog: (id: string) => void;
  onDownloadCSV: () => void;
  onClearLogs: () => void;
}

export function LogTable({ logs, currentPurchaseId, onDeleteLog, onDownloadCSV, onClearLogs }: LogTableProps) {
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Logs</h2>
        <div className="space-x-2">
          <button
            onClick={onDownloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Export CSV
          </button>
          <button
            onClick={onClearLogs}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Clear Logs
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log) => (
              <tr
                key={log.id}
                className={log.purchaseId === currentPurchaseId ? 'bg-yellow-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{log.itemName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{log.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onDeleteLog(log.id)}
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