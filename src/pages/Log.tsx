import { CurrentPurchaseItems } from '../components/CurrentLogItems';
import { ItemSearch } from '../components/ItemSearch';
import { LogTable } from '../components/LogTable';

export default function LogPage() {
  return (
    <div className="space-y-4 p-4">

      <CurrentPurchaseItems />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ItemSearch />
      </div>
      <LogTable />
    </div>
  );
} 