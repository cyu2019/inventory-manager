import clsx from "clsx";
import { useLogs } from "../contexts/LogsContext";
import { TouchButton } from "./TouchButton";

interface EnrichedLogEntry {
  id: string;
  itemId: string;
  timestamp: number;
  purchaseId: string;
  itemName: string;
  category: string;
}

export function LogTable() {
  const { logs, currentPurchaseId, deleteLog, addLog, clearLogs, downloadCSV, resumePurchase } = useLogs();

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Logs</h2>
        <div className="space-x-2 flex items-center">
          <TouchButton
            onClick={downloadCSV}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Export CSV
          </TouchButton>
          <TouchButton
            onClick={clearLogs}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Clear Logs
          </TouchButton>

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
            {(() => {
              let purchases = 0;
              let countingPurchase = "";
              return logs.map((log) => {
                if (countingPurchase !== log.purchaseId) {
                  countingPurchase = log.purchaseId
                  purchases++;
                }
                return (
                  <tr
                    key={log.id}
                    className={log.purchaseId === currentPurchaseId ? 'bg-yellow-50' : purchases % 2 == 0 ? "bg-neutral-100" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <span>{log.itemName}</span>
                        <button
                          onClick={() => addLog(log.itemId)}
                          className="text-blue-500"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{log.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => deleteLog(log.id)}
                          className="text-red-600 "
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => resumePurchase(log.purchaseId)}
                          className="text-blue-500"
                        >
                          Resume
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}