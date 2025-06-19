
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAllStores, addStore, removeStore, initializeStoreData, Store } from "@/data/storeData";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardTabs from "@/components/DashboardTabs";

const Dashboard = () => {
  const [storeList, setStoreList] = useState<Store[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    initializeStoreData();
    const stores = getAllStores();
    setStoreList(stores);
  };

  const handleAddStore = (newStore: Store) => {
    addStore(newStore);
    loadData();
    toast.success("Loja adicionada com sucesso!", {
      description: `${newStore.name} foi adicionada ao sistema.`
    });
  };

  const handleRemoveStore = (storeId: number, storeName: string) => {
    removeStore(storeId);
    loadData();
    toast.success("Loja removida com sucesso!", {
      description: `${storeName} foi removida do sistema.`
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <DashboardHeader />
      <DashboardTabs
        storeList={storeList}
        onAddStore={handleAddStore}
        onRemoveStore={handleRemoveStore}
      />
    </div>
  );
};

export default Dashboard;
