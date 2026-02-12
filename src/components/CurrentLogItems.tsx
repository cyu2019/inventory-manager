import clsx from "clsx";
import { useLogs } from "../contexts/LogsContext";
import { TouchButton } from "./TouchButton";

export function CurrentPurchaseItems() {
  const { logs, currentPurchaseId, deleteLog, completePurchase } = useLogs();

  const currentLogs = logs.filter(log => log.purchaseId === currentPurchaseId);
  const hasActivePurchase = !!currentLogs.length

  return (
    <div className="flex">
      <div className="flex flex-1 gap-2 items-center mt-4 p-2 bg-gray-50 rounded-lg overflow-x-auto h-24">
        {!currentLogs.length && "No items in purchase"}
        {currentLogs.map(log => (
          <div
            key={log.id}
            className="flex items-center gap-1 bg-white px-3 py-1 rounded-full shadow-sm whitespace-nowrap"
          >
            <span>{log.itemName}</span>
            <TouchButton
              onClick={() => deleteLog(log.id)}
              className="font-medium text-white bg-red-500"
            >
              ×
            </TouchButton>
          </div>
        ))}

      </div>
      <TouchButton
        onClick={completePurchase}
        className={clsx("text-white", hasActivePurchase ? "bg-blue-500" : "bg-neutral-500")}
      >
        Complete Purchase
      </TouchButton>
    </div>
  );
} 