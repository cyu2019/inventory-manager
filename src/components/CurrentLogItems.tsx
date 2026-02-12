import clsx from "clsx";
import { useLogs } from "../contexts/LogsContext";
import { TouchButton } from "./TouchButton";
import { useMemo, type ReactNode } from "react";

export function CurrentPurchaseItems() {
  const { logs, currentPurchaseId, deleteLog, completePurchase } = useLogs();

  const currentLogs = useMemo(() => logs.filter(log => log.purchaseId === currentPurchaseId), [currentPurchaseId, logs]);
  const hasActivePurchase = !!currentLogs.length

  const pills = useMemo(() => {
    const ret: ReactNode[] = [];

    let countingLeft = 0;
    currentLogs.forEach((log) => {
      const width = 11 * log.itemName.length + 80
      const left = countingLeft;
      countingLeft += width + 15;
      ret.push(
        <div
          key={log.id}
          className={clsx(
            "flex items-center justify-between px-3 bg-white rounded-full shadow-sm whitespace-nowrap",
            "absolute transition-all",
            "font-mono"
          )}
          style={{
            left,
            width,
            fontSize: 20,
          }}
        >
          <span>{log.itemName}</span>
          <TouchButton
            onClick={() => deleteLog(log.id)}
            className="font-medium text-white bg-red-500"
          >
            ×
          </TouchButton>
        </div>
      )
    })
    return ret;
  }, [currentLogs])

  return (
    <div className="flex">
      <div className="flex flex-1 gap-2 items-center bg-gray-50 rounded-lg overflow-x-auto h-24 relative">
        {!currentLogs.length ? "No items in purchase" : pills}
      </div>
      <TouchButton
        onClick={completePurchase}
        className={clsx("text-white h-24 w-24", hasActivePurchase ? "bg-blue-500" : "bg-neutral-500")}
      >
        ✓
      </TouchButton>
    </div>
  );
} 