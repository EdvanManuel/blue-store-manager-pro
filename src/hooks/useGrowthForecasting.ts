
import { useState, useEffect } from 'react';
import { getAllStores, getAllProducts, getSalesDataByStoreId } from '@/data/storeData';

export interface GrowthPrediction {
  nextMonth: number;
  nextQuarter: number;
  nextYear: number;
  confidence: number;
  trend: 'bullish' | 'bearish' | 'neutral';
}

export interface StoreGrowthAnalysis {
  storeId: number;
  storeName: string;
  currentRevenue: number;
  lastMonthRevenue: number;
  growthRate: number;
  prediction: GrowthPrediction;
  riskFactors: string[];
  opportunities: string[];
}

export const useGrowthForecasting = () => {
  const [globalGrowthAnalysis, setGlobalGrowthAnalysis] = useState<GrowthPrediction | null>(null);
  const [storeGrowthAnalyses, setStoreGrowthAnalyses] = useState<StoreGrowthAnalysis[]>([]);

  const calculateTrendAnalysis = (salesHistory: number[]): GrowthPrediction => {
    if (salesHistory.length < 2) {
      return {
        nextMonth: 0,
        nextQuarter: 0,
        nextYear: 0,
        confidence: 0,
        trend: 'neutral'
      };
    }

    // Simple linear regression for trend analysis
    const n = salesHistory.length;
    const xSum = n * (n - 1) / 2;
    const ySum = salesHistory.reduce((sum, val) => sum + val, 0);
    const xySum = salesHistory.reduce((sum, val, index) => sum + (val * index), 0);
    const xSquareSum = n * (n - 1) * (2 * n - 1) / 6;

    const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);
    const intercept = (ySum - slope * xSum) / n;

    // Predict future values
    const nextMonth = slope * n + intercept;
    const nextQuarter = slope * (n + 2) + intercept;
    const nextYear = slope * (n + 11) + intercept;

    // Calculate confidence based on consistency of trend
    const predictions = salesHistory.map((_, index) => slope * index + intercept);
    const errors = salesHistory.map((actual, index) => Math.abs(actual - predictions[index]));
    const avgError = errors.reduce((sum, error) => sum + error, 0) / errors.length;
    const avgValue = ySum / n;
    const confidence = Math.max(0, Math.min(100, 100 - (avgError / avgValue) * 100));

    // Determine trend
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (slope > avgValue * 0.05) trend = 'bullish';
    else if (slope < -avgValue * 0.05) trend = 'bearish';

    return {
      nextMonth: Math.max(0, nextMonth),
      nextQuarter: Math.max(0, nextQuarter),
      nextYear: Math.max(0, nextYear),
      confidence,
      trend
    };
  };

  const analyzeStoreGrowth = (store: { id: number; name: string }): StoreGrowthAnalysis => {
    const products = getAllProducts().filter(p => p.storeId === store.id);
    const salesData = getSalesDataByStoreId(store.id);
    
    const currentRevenue = products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0);
    const salesHistory = salesData.map(data => data.amount);
    const lastMonthRevenue = salesHistory[salesHistory.length - 2] || currentRevenue;
    
    const growthRate = lastMonthRevenue > 0 ? 
      ((currentRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const prediction = calculateTrendAnalysis(salesHistory);

    // Analyze risk factors
    const riskFactors: string[] = [];
    const lowStockProducts = products.filter(p => p.quantity < 5).length;
    const expiringProducts = products.filter(p => {
      const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    }).length;

    if (lowStockProducts > 5) riskFactors.push('Alto número de produtos com estoque baixo');
    if (expiringProducts > 3) riskFactors.push('Produtos próximos ao vencimento');
    if (growthRate < -10) riskFactors.push('Declínio significativo nas vendas');
    if (prediction.confidence < 50) riskFactors.push('Baixa previsibilidade de vendas');

    // Identify opportunities
    const opportunities: string[] = [];
    const highMarginProducts = products.filter(p => {
      const margin = ((p.sellingPrice - p.costPrice) / p.costPrice) * 100;
      return margin > 50;
    }).length;

    if (highMarginProducts > 5) opportunities.push('Expandir produtos de alta margem');
    if (growthRate > 10) opportunities.push('Capitalizar crescimento atual');
    if (prediction.trend === 'bullish') opportunities.push('Aumentar investimento em estoque');
    if (products.length < 10) opportunities.push('Diversificar portfólio de produtos');

    return {
      storeId: store.id,
      storeName: store.name,
      currentRevenue,
      lastMonthRevenue,
      growthRate,
      prediction,
      riskFactors,
      opportunities
    };
  };

  const refreshGrowthAnalysis = () => {
    const stores = getAllStores();
    
    // Analyze each store
    const storeAnalyses = stores.map(store => analyzeStoreGrowth(store));
    setStoreGrowthAnalyses(storeAnalyses);

    // Calculate global growth prediction
    const totalCurrentRevenue = storeAnalyses.reduce((sum, analysis) => sum + analysis.currentRevenue, 0);
    const totalLastMonthRevenue = storeAnalyses.reduce((sum, analysis) => sum + analysis.lastMonthRevenue, 0);
    const globalGrowthRate = totalLastMonthRevenue > 0 ? 
      ((totalCurrentRevenue - totalLastMonthRevenue) / totalLastMonthRevenue) * 100 : 0;

    // Aggregate all sales history for global prediction
    const allSalesData = stores.flatMap(store => getSalesDataByStoreId(store.id));
    const monthlyTotals = allSalesData.reduce((acc, sale) => {
      acc[sale.month] = (acc[sale.month] || 0) + sale.amount;
      return acc;
    }, {} as Record<string, number>);

    const globalSalesHistory = Object.values(monthlyTotals);
    const globalPrediction = calculateTrendAnalysis(globalSalesHistory);
    
    setGlobalGrowthAnalysis(globalPrediction);
  };

  useEffect(() => {
    refreshGrowthAnalysis();
  }, []);

  return {
    globalGrowthAnalysis,
    storeGrowthAnalyses,
    refreshGrowthAnalysis
  };
};
