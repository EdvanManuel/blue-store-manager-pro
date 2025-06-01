
import { useState, useEffect } from 'react';
import { Store, Product, getAllStores, getAllProducts, getSalesDataByStoreId } from '@/data/storeData';

export interface StoreAnalytics {
  totalRevenue: number;
  profitMargin: number;
  inventoryValue: number;
  topProducts: Product[];
  lowStockAlerts: Product[];
  expiryAlerts: Product[];
  salesTrend: 'up' | 'down' | 'stable';
  efficiency: number;
}

export interface SystemAnalytics {
  totalStores: number;
  totalProducts: number;
  totalInventoryValue: number;
  totalRevenue: number;
  avgProfitMargin: number;
  criticalAlerts: number;
  topPerformingStore: Store | null;
  predictedSales: number;
}

export const useAnalytics = () => {
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [storeAnalytics, setStoreAnalytics] = useState<Map<number, StoreAnalytics>>(new Map());

  const calculateStoreAnalytics = (store: Store, products: Product[]): StoreAnalytics => {
    const storeProducts = products.filter(p => p.storeId === store.id);
    
    const totalRevenue = storeProducts.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const totalCost = storeProducts.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const profitMargin = totalCost > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
    const inventoryValue = totalCost;
    
    const topProducts = storeProducts
      .sort((a, b) => (b.sellingPrice * b.quantity) - (a.sellingPrice * a.quantity))
      .slice(0, 5);
    
    const lowStockAlerts = storeProducts.filter(p => p.quantity < 5);
    const expiryAlerts = storeProducts.filter(p => {
      const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });
    
    const salesTrend: 'up' | 'down' | 'stable' = store.monthlySales > 100000 ? 'up' : store.monthlySales < 80000 ? 'down' : 'stable';
    const efficiency = Math.min(100, (storeProducts.length * 10) + (profitMargin * 2));

    return {
      totalRevenue,
      profitMargin,
      inventoryValue,
      topProducts,
      lowStockAlerts,
      expiryAlerts,
      salesTrend,
      efficiency
    };
  };

  const calculateSystemAnalytics = (): SystemAnalytics => {
    const stores = getAllStores();
    const products = getAllProducts();
    
    const totalStores = stores.length;
    const totalProducts = products.length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const totalRevenue = stores.reduce((sum, s) => sum + s.monthlySales, 0);
    const avgProfitMargin = stores.length > 0 ? 
      stores.reduce((sum, s) => {
        const storeProducts = products.filter(p => p.storeId === s.id);
        const revenue = storeProducts.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
        const cost = storeProducts.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
        return sum + (cost > 0 ? ((revenue - cost) / revenue) * 100 : 0);
      }, 0) / stores.length : 0;
    
    const criticalAlerts = products.filter(p => p.quantity < 5).length + 
      products.filter(p => {
        const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length;
    
    const topPerformingStore = stores.reduce((best, current) => 
      current.monthlySales > (best?.monthlySales || 0) ? current : best, null as Store | null);
    
    const predictedSales = totalRevenue * 1.1; // 10% growth prediction

    return {
      totalStores,
      totalProducts,
      totalInventoryValue,
      totalRevenue,
      avgProfitMargin,
      criticalAlerts,
      topPerformingStore,
      predictedSales
    };
  };

  useEffect(() => {
    const stores = getAllStores();
    const products = getAllProducts();
    
    // Calculate system analytics
    setSystemAnalytics(calculateSystemAnalytics());
    
    // Calculate analytics for each store
    const analyticsMap = new Map<number, StoreAnalytics>();
    stores.forEach(store => {
      analyticsMap.set(store.id, calculateStoreAnalytics(store, products));
    });
    setStoreAnalytics(analyticsMap);
  }, []);

  return {
    systemAnalytics,
    storeAnalytics,
    refreshAnalytics: () => {
      const stores = getAllStores();
      const products = getAllProducts();
      setSystemAnalytics(calculateSystemAnalytics());
      const analyticsMap = new Map<number, StoreAnalytics>();
      stores.forEach(store => {
        analyticsMap.set(store.id, calculateStoreAnalytics(store, products));
      });
      setStoreAnalytics(analyticsMap);
    }
  };
};
