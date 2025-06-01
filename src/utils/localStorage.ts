
import { Store } from "@/data/storeData";

const STORES_STORAGE_KEY = 'store_manager_stores';

export const saveStoresToLocalStorage = (stores: Store[]): void => {
  try {
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
  }
};

export const getStoresFromLocalStorage = (): Store[] | null => {
  try {
    const storedData = localStorage.getItem(STORES_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do localStorage:', error);
    return null;
  }
};

export const updateStoreInLocalStorage = (updatedStore: Store): void => {
  const storedStores = getStoresFromLocalStorage();
  if (storedStores) {
    const updatedStores = storedStores.map(store => 
      store.id === updatedStore.id ? updatedStore : store
    );
    saveStoresToLocalStorage(updatedStores);
  }
};
