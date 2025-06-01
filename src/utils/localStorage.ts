
import { Store, Product } from "@/data/storeData";

const STORES_STORAGE_KEY = 'store_manager_stores';
const PRODUCTS_STORAGE_KEY = 'store_manager_products';
const SETTINGS_STORAGE_KEY = 'store_manager_settings';

export const saveStoresToLocalStorage = (stores: Store[]): void => {
  try {
    localStorage.setItem(STORES_STORAGE_KEY, JSON.stringify(stores));
    console.log('✅ Dados das lojas salvos no localStorage');
  } catch (error) {
    console.error('❌ Erro ao salvar dados no localStorage:', error);
  }
};

export const getStoresFromLocalStorage = (): Store[] | null => {
  try {
    const storedData = localStorage.getItem(STORES_STORAGE_KEY);
    console.log('📥 Recuperando dados das lojas do localStorage');
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('❌ Erro ao recuperar dados do localStorage:', error);
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
    console.log('🔄 Loja atualizada no localStorage:', updatedStore.name);
  }
};

export const addStoreToLocalStorage = (newStore: Store): void => {
  const storedStores = getStoresFromLocalStorage();
  const stores = storedStores || [];
  const updatedStores = [...stores, newStore];
  saveStoresToLocalStorage(updatedStores);
  console.log('➕ Nova loja adicionada ao localStorage:', newStore.name);
};

export const removeStoreFromLocalStorage = (storeId: number): void => {
  const storedStores = getStoresFromLocalStorage();
  if (storedStores) {
    const storeToRemove = storedStores.find(store => store.id === storeId);
    const updatedStores = storedStores.filter(store => store.id !== storeId);
    saveStoresToLocalStorage(updatedStores);
    console.log('🗑️ Loja removida do localStorage:', storeToRemove?.name);
  }
};

export const saveProductsToLocalStorage = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    console.log('✅ Dados dos produtos salvos no localStorage');
  } catch (error) {
    console.error('❌ Erro ao salvar produtos no localStorage:', error);
  }
};

export const getProductsFromLocalStorage = (): Product[] | null => {
  try {
    const storedData = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    console.log('📥 Recuperando dados dos produtos do localStorage');
    return storedData ? JSON.parse(storedData) : null;
  } catch (error) {
    console.error('❌ Erro ao recuperar produtos do localStorage:', error);
    return null;
  }
};

export const updateProductInLocalStorage = (updatedProduct: Product): void => {
  const storedProducts = getProductsFromLocalStorage();
  if (storedProducts) {
    const updatedProducts = storedProducts.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    );
    saveProductsToLocalStorage(updatedProducts);
    console.log('🔄 Produto atualizado no localStorage:', updatedProduct.name);
  }
};

// Settings management
interface SystemSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoBackup: boolean;
  language: 'pt' | 'en';
  currency: 'AOA' | 'USD' | 'EUR';
  lowStockThreshold: number;
  expiryWarningDays: number;
}

const defaultSettings: SystemSettings = {
  theme: 'light',
  notifications: true,
  autoBackup: true,
  language: 'pt',
  currency: 'AOA',
  lowStockThreshold: 5,
  expiryWarningDays: 30
};

export const saveSettingsToLocalStorage = (settings: SystemSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    console.log('⚙️ Configurações salvas no localStorage');
  } catch (error) {
    console.error('❌ Erro ao salvar configurações:', error);
  }
};

export const getSettingsFromLocalStorage = (): SystemSettings => {
  try {
    const storedData = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return storedData ? { ...defaultSettings, ...JSON.parse(storedData) } : defaultSettings;
  } catch (error) {
    console.error('❌ Erro ao recuperar configurações:', error);
    return defaultSettings;
  }
};

// Backup and restore functions
export const exportAllData = () => {
  const stores = getStoresFromLocalStorage();
  const products = getProductsFromLocalStorage();
  const settings = getSettingsFromLocalStorage();
  
  const backup = {
    stores: stores || [],
    products: products || [],
    settings,
    exportDate: new Date().toISOString(),
    version: '2.0'
  };
  
  const dataStr = JSON.stringify(backup, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `sistema_inteligente_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  console.log('💾 Backup completo exportado');
};

export const importAllData = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        if (backup.stores) saveStoresToLocalStorage(backup.stores);
        if (backup.products) saveProductsToLocalStorage(backup.products);
        if (backup.settings) saveSettingsToLocalStorage(backup.settings);
        
        console.log('📥 Backup importado com sucesso');
        resolve(true);
      } catch (error) {
        console.error('❌ Erro ao importar backup:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsText(file);
  });
};
