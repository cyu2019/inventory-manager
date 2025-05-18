import { useLogs } from "../contexts/LogsContext";

export function LogHeader() {
  const {
    completePurchase
  } = useLogs();

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Log Entry</h1>
      <button
        onClick={completePurchase}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Complete Purchase
      </button>
    </div>
  );
} 