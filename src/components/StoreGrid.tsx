
import { Store } from "@/data/storeData";
import StoreCard from "./StoreCard";
import AddStoreCard from "./AddStoreCard";

interface StoreGridProps {
  stores: Store[];
  showAddStore: boolean;
  onAddStoreClick: () => void;
  onRemoveStore: (storeId: number, storeName: string) => void;
}

const StoreGrid = ({ stores, showAddStore, onAddStoreClick, onRemoveStore }: StoreGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onRemove={onRemoveStore}
        />
      ))}
      
      {!showAddStore && (
        <AddStoreCard onAddClick={onAddStoreClick} />
      )}
    </div>
  );
};

export default StoreGrid;
