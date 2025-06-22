
import { useState, useEffect } from 'react';
import { getAllStores, getAllProducts } from '@/data/storeData';

export interface FinancialMetrics {
  totalRevenue: number;
  totalCosts: number;
  grossProfit: number;
  profitMargin: number;
  monthlyGrowth: number;
  operationalExpenses: number;
  netProfit: number;
  cashFlow: number;
}

export interface MonthlyComparison {
  currentMonth: FinancialMetrics;
  previousMonth: FinancialMetrics;
  growthPercentage: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface StoreFinancials {
  storeId: number;
  storeName: string;
  metrics: FinancialMetrics;
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

export const useFinancialManagement = () => {
  const [globalFinancials, setGlobalFinancials] = useState<FinancialMetrics | null>(null);
  const [storeFinancials, setStoreFinancials] = useState<StoreFinancials[]>([]);
  const [monthlyComparison, setMonthlyComparison] = useState<MonthlyComparison | null>(null);

  const calculateStoreFinancials = (storeId: number, storeName: string): StoreFinancials => {
    const products = getAllProducts().filter(p => p.storeId === storeId);
    
    const totalRevenue = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const totalCosts = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const grossProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    
    // Simulated operational expenses (10% of revenue)
    const operationalExpenses = totalRevenue * 0.1;
    const netProfit = grossProfit - operationalExpenses;
    const cashFlow = netProfit; // Simplified cash flow
    
    // Simulated monthly growth (random for demo)
    const monthlyGrowth = Math.random() * 20 - 10; // -10% to +10%

    const metrics: FinancialMetrics = {
      totalRevenue,
      totalCosts,
      grossProfit,
      profitMargin,
      monthlyGrowth,
      operationalExpenses,
      netProfit,
      cashFlow
    };

    // Determine performance
    let performance: 'excellent' | 'good' | 'average' | 'poor' = 'poor';
    if (profitMargin > 30) performance = 'excellent';
    else if (profitMargin > 20) performance = 'good';
    else if (profitMargin > 10) performance = 'average';

    return {
      storeId,
      storeName,
      metrics,
      performance
    };
  };

  const calculateGlobalFinancials = (): FinancialMetrics => {
    const stores = getAllStores();
    const storeFinancialsList = stores.map(store => 
      calculateStoreFinancials(store.id, store.name)
    );

    const totalRevenue = storeFinancialsList.reduce((sum, sf) => sum + sf.metrics.totalRevenue, 0);
    const totalCosts = storeFinancialsList.reduce((sum, sf) => sum + sf.metrics.totalCosts, 0);
    const grossProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;
    const operationalExpenses = storeFinancialsList.reduce((sum, sf) => sum + sf.metrics.operationalExpenses, 0);
    const netProfit = grossProfit - operationalExpenses;
    const cashFlow = netProfit;
    const monthlyGrowth = storeFinancialsList.reduce((sum, sf) => sum + sf.metrics.monthlyGrowth, 0) / storeFinancialsList.length;

    return {
      totalRevenue,
      totalCosts,
      grossProfit,
      profitMargin,
      monthlyGrowth,
      operationalExpenses,
      netProfit,
      cashFlow
    };
  };

  const generateMonthlyComparison = (current: FinancialMetrics): MonthlyComparison => {
    // Simulate previous month data (90-110% of current)
    const variance = 0.9 + Math.random() * 0.2;
    const previous: FinancialMetrics = {
      totalRevenue: current.totalRevenue * variance,
      totalCosts: current.totalCosts * variance,
      grossProfit: current.grossProfit * variance,
      profitMargin: current.profitMargin * variance,
      monthlyGrowth: current.monthlyGrowth - 5,
      operationalExpenses: current.operationalExpenses * variance,
      netProfit: current.netProfit * variance,
      cashFlow: current.cashFlow * variance
    };

    const growthPercentage = ((current.totalRevenue - previous.totalRevenue) / previous.totalRevenue) * 100;
    
    let trendDirection: 'up' | 'down' | 'stable' = 'stable';
    if (growthPercentage > 2) trendDirection = 'up';
    else if (growthPercentage < -2) trendDirection = 'down';

    return {
      currentMonth: current,
      previousMonth: previous,
      growthPercentage,
      trendDirection
    };
  };

  const refreshFinancials = () => {
    const stores = getAllStores();
    
    // Calculate store financials
    const storeFinancialsList = stores.map(store => 
      calculateStoreFinancials(store.id, store.name)
    );
    setStoreFinancials(storeFinancialsList);

    // Calculate global financials
    const global = calculateGlobalFinancials();
    setGlobalFinancials(global);

    // Generate monthly comparison
    const comparison = generateMonthlyComparison(global);
    setMonthlyComparison(comparison);
  };

  useEffect(() => {
    refreshFinancials();
  }, []);

  const exportFinancialReport = () => {
    const reportData = {
      globalFinancials,
      storeFinancials,
      monthlyComparison,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-financeiro-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    globalFinancials,
    storeFinancials,
    monthlyComparison,
    refreshFinancials,
    exportFinancialReport
  };
};
