
import { Store, Product } from "@/data/storeData";

const STORES_STORAGE_KEY = 'store_manager_stores';
const PRODUCTS_STORAGE_KEY = 'store_manager_products';

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

export const saveProductsToLocalStorage = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error('Erro ao salvar produtos no localStorage:', error);
  }
};

export const getProductsFromLocalStorage = (): Product[] | null => {
  try {
    const storedData = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('Erro ao recuperar produtos do localStorage:', error);
    return null;
  }
};
