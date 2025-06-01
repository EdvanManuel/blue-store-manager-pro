import { getStoresFromLocalStorage, saveStoresToLocalStorage } from "@/utils/localStorage";

export interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  monthlySales: number;
  criticalStock: number; // Number of products with low stock
  expiringProducts: number; // Number of products close to expiration
}

export interface Product {
  id: number;
  storeId: number;
  name: string;
  code: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  quantity: number;
  entryDate: string;
  expiryDate: string;
  imageUrl?: string;
}

export interface SalesData {
  storeId: number;
  month: string;
  amount: number;
}

// Sample stores data
export const stores: Store[] = [
  {
    id: 1,
    name: "Loja Central",
    address: "Rua Principal 123, Centro",
    phone: "+244 974334771",
    email: "central@lojas.com",
    monthlySales: 150000,
    criticalStock: 5,
    expiringProducts: 3
  },
  {
    id: 2,
    name: "Loja Norte",
    address: "Avenida Norte 456, Bairro Norte",
    phone: "+244 974334772",
    email: "norte@lojas.com",
    monthlySales: 200000,
    criticalStock: 2,
    expiringProducts: 7
  },
  {
    id: 3,
    name: "Loja Sul",
    address: "Praça Sul 789, Zona Sul",
    phone: "+244 974334773",
    email: "sul@lojas.com",
    monthlySales: 120000,
    criticalStock: 8,
    expiringProducts: 4
  }
];

// Sample products data
export const products: Product[] = [
  // Store 1 Products
  {
    id: 101,
    storeId: 1,
    name: "Arroz Premium",
    code: "ARR001",
    category: "Alimentos",
    costPrice: 2000,
    sellingPrice: 3500,
    quantity: 50,
    entryDate: "2025-03-01",
    expiryDate: "2025-08-01"
  },
  {
    id: 102,
    storeId: 1,
    name: "Feijão Preto",
    code: "FEI001",
    category: "Alimentos",
    costPrice: 1500,
    sellingPrice: 2800,
    quantity: 30,
    entryDate: "2025-03-05",
    expiryDate: "2025-07-05"
  },
  {
    id: 103,
    storeId: 1,
    name: "Óleo de Cozinha",
    code: "OLE001",
    category: "Alimentos",
    costPrice: 1200,
    sellingPrice: 2000,
    quantity: 4,
    entryDate: "2025-03-10",
    expiryDate: "2025-06-10"
  },
  {
    id: 104,
    storeId: 1,
    name: "Sabão em Pó",
    code: "SAB001",
    category: "Limpeza",
    costPrice: 800,
    sellingPrice: 1500,
    quantity: 3,
    entryDate: "2025-03-15",
    expiryDate: "2026-03-15"
  },
  {
    id: 105,
    storeId: 1,
    name: "Leite em Pó",
    code: "LEI001",
    category: "Laticínios",
    costPrice: 1800,
    sellingPrice: 3000,
    quantity: 20,
    entryDate: "2025-04-01",
    expiryDate: "2025-06-01"
  },
  
  // Store 2 Products
  {
    id: 201,
    storeId: 2,
    name: "Macarrão Instantâneo",
    code: "MAC001",
    category: "Alimentos",
    costPrice: 500,
    sellingPrice: 900,
    quantity: 100,
    entryDate: "2025-03-01",
    expiryDate: "2025-09-01"
  },
  {
    id: 202,
    storeId: 2,
    name: "Refrigerante Cola",
    code: "REF001",
    category: "Bebidas",
    costPrice: 300,
    sellingPrice: 600,
    quantity: 80,
    entryDate: "2025-03-10",
    expiryDate: "2025-06-10"
  },
  {
    id: 203,
    storeId: 2,
    name: "Biscoito Recheado",
    code: "BIS001",
    category: "Alimentos",
    costPrice: 200,
    sellingPrice: 450,
    quantity: 1,
    entryDate: "2025-03-15",
    expiryDate: "2025-05-30"
  },
  {
    id: 204,
    storeId: 2,
    name: "Água Mineral",
    code: "AGU001",
    category: "Bebidas",
    costPrice: 100,
    sellingPrice: 250,
    quantity: 200,
    entryDate: "2025-04-01",
    expiryDate: "2026-04-01"
  },
  {
    id: 205,
    storeId: 2,
    name: "Queijo Mussarela",
    code: "QUE001",
    category: "Laticínios",
    costPrice: 1500,
    sellingPrice: 2500,
    quantity: 15,
    entryDate: "2025-04-05",
    expiryDate: "2025-05-20"
  },
  
  // Store 3 Products
  {
    id: 301,
    storeId: 3,
    name: "Farinha de Trigo",
    code: "FAR001",
    category: "Alimentos",
    costPrice: 600,
    sellingPrice: 1100,
    quantity: 40,
    entryDate: "2025-03-01",
    expiryDate: "2025-09-01"
  },
  {
    id: 302,
    storeId: 3,
    name: "Açúcar Refinado",
    code: "ACU001",
    category: "Alimentos",
    costPrice: 700,
    sellingPrice: 1300,
    quantity: 3,
    entryDate: "2025-03-10",
    expiryDate: "2026-03-10"
  },
  {
    id: 303,
    storeId: 3,
    name: "Café Torrado",
    code: "CAF001",
    category: "Alimentos",
    costPrice: 1000,
    sellingPrice: 1800,
    quantity: 25,
    entryDate: "2025-03-15",
    expiryDate: "2025-09-15"
  },
  {
    id: 304,
    storeId: 3,
    name: "Molho de Tomate",
    code: "MOL001",
    category: "Alimentos",
    costPrice: 400,
    sellingPrice: 750,
    quantity: 35,
    entryDate: "2025-04-01",
    expiryDate: "2025-06-01"
  },
  {
    id: 305,
    storeId: 3,
    name: "Sabonete",
    code: "SAB002",
    category: "Higiene",
    costPrice: 200,
    sellingPrice: 350,
    quantity: 2,
    entryDate: "2025-04-05",
    expiryDate: "2026-04-05"
  }
];

// Sales data for charts
export const salesData: SalesData[] = [
  // Store 1
  { storeId: 1, month: "Janeiro", amount: 130000 },
  { storeId: 1, month: "Fevereiro", amount: 140000 },
  { storeId: 1, month: "Março", amount: 135000 },
  { storeId: 1, month: "Abril", amount: 145000 },
  { storeId: 1, month: "Maio", amount: 150000 },
  { storeId: 1, month: "Junho", amount: 155000 },
  
  // Store 2
  { storeId: 2, month: "Janeiro", amount: 180000 },
  { storeId: 2, month: "Fevereiro", amount: 185000 },
  { storeId: 2, month: "Março", amount: 190000 },
  { storeId: 2, month: "Abril", amount: 195000 },
  { storeId: 2, month: "Maio", amount: 200000 },
  { storeId: 2, month: "Junho", amount: 205000 },
  
  // Store 3
  { storeId: 3, month: "Janeiro", amount: 100000 },
  { storeId: 3, month: "Fevereiro", amount: 105000 },
  { storeId: 3, month: "Março", amount: 110000 },
  { storeId: 3, month: "Abril", amount: 115000 },
  { storeId: 3, month: "Maio", amount: 120000 },
  { storeId: 3, month: "Junho", amount: 125000 }
];

// Get store by ID with localStorage support
export const getStoreById = (id: number): Store | undefined => {
  const storedStores = getStoresFromLocalStorage();
  const storesData = storedStores || stores;
  return storesData.find(store => store.id === id);
};

// Get all stores with localStorage support
export const getAllStores = (): Store[] => {
  const storedStores = getStoresFromLocalStorage();
  return storedStores || stores;
};

// Update store data
export const updateStore = (updatedStore: Store): void => {
  const storedStores = getStoresFromLocalStorage();
  const storesData = storedStores || stores;
  
  const updatedStores = storesData.map(store => 
    store.id === updatedStore.id ? updatedStore : store
  );
  
  saveStoresToLocalStorage(updatedStores);
};

// Initialize localStorage with default data if empty
export const initializeStoreData = (): void => {
  const storedStores = getStoresFromLocalStorage();
  if (!storedStores) {
    saveStoresToLocalStorage(stores);
  }
};

// Get products by store ID
export const getProductsByStoreId = (storeId: number): Product[] => {
  return products.filter(product => product.storeId === storeId);
};

// Get sales data by store ID
export const getSalesDataByStoreId = (storeId: number): SalesData[] => {
  return salesData.filter(data => data.storeId === storeId);
};

// Get all sales data
export const getAllSalesData = (): SalesData[] => {
  return salesData;
};

// Utility function to calculate days until expiry
export const daysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Utility function to check if a product is close to expiry (less than 30 days)
export const isCloseToExpiry = (expiryDate: string): boolean => {
  return daysUntilExpiry(expiryDate) <= 30;
};

// Utility function to check if a product has low stock (less than 5 units)
export const hasLowStock = (quantity: number): boolean => {
  return quantity < 5;
};
