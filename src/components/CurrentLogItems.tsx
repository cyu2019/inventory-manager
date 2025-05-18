import { useLogs } from "../contexts/LogsContext";

export function CurrentPurchaseItems() {
  const { logs, currentPurchaseId, deleteLog } = useLogs();

  const currentLogs = logs.filter(log => log.purchaseId === currentPurchaseId);

  return (
    <div className="flex flex-wrap gap-2 items-center mt-4 p-2 bg-gray-50 rounded-lg">
      {!currentLogs.length && "No items in purchase"}
      {currentLogs.map(log => (
        <div
          key={log.id}
          className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm"
        >
          <span>{log.itemName}</span>
          <button
            onClick={() => deleteLog(log.id)}
            className="text-red-500 hover:text-red-700 font-medium"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
} 