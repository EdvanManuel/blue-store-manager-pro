
import { useState, useEffect } from 'react';
import { 
  getAllStores, 
  getAllProducts, 
  getAllSalesData,
  updateStore,
  updateProduct,
  Store,
  Product
} from '@/data/storeData';
import { toast } from 'sonner';

export interface SystemInconsistency {
  id: string;
  type: 'data_mismatch' | 'missing_data' | 'calculation_error' | 'outdated_info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedEntity: string;
  currentValue: any;
  suggestedValue: any;
  autoFixable: boolean;
}

export interface SystemAnalysisReport {
  totalInconsistencies: number;
  criticalIssues: number;
  dataQualityScore: number;
  lastSyncDate: Date;
  recommendations: string[];
  inconsistencies: SystemInconsistency[];
}

export const useSystemAnalysis = () => {
  const [analysisReport, setAnalysisReport] = useState<SystemAnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const detectInconsistencies = (): SystemInconsistency[] => {
    const stores = getAllStores();
    const products = getAllProducts();
    const salesData = getAllSalesData();
    const inconsistencies: SystemInconsistency[] = [];

    // Verificar inconsistências nas estatísticas das lojas
    stores.forEach(store => {
      const storeProducts = products.filter(p => p.storeId === store.id);
      
      // Verificar produtos com estoque crítico
      const actualCriticalStock = storeProducts.filter(p => p.quantity < 5).length;
      if (store.criticalStock !== actualCriticalStock) {
        inconsistencies.push({
          id: `critical-stock-${store.id}`,
          type: 'data_mismatch',
          severity: 'high',
          description: `Contagem de estoque crítico incorreta para ${store.name}`,
          affectedEntity: `Loja: ${store.name}`,
          currentValue: store.criticalStock,
          suggestedValue: actualCriticalStock,
          autoFixable: true
        });
      }

      // Verificar produtos próximos ao vencimento
      const actualExpiringProducts = storeProducts.filter(p => {
        const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      }).length;

      if (store.expiringProducts !== actualExpiringProducts) {
        inconsistencies.push({
          id: `expiring-products-${store.id}`,
          type: 'data_mismatch',
          severity: 'medium',
          description: `Contagem de produtos próximos ao vencimento incorreta para ${store.name}`,
          affectedEntity: `Loja: ${store.name}`,
          currentValue: store.expiringProducts,
          suggestedValue: actualExpiringProducts,
          autoFixable: true
        });
      }

      // Verificar se há vendas registradas para a loja
      const storeSales = salesData.filter(s => s.storeId === store.id);
      if (storeSales.length === 0 && store.monthlySales > 0) {
        inconsistencies.push({
          id: `sales-data-${store.id}`,
          type: 'missing_data',
          severity: 'critical',
          description: `Dados de vendas inconsistentes para ${store.name}`,
          affectedEntity: `Loja: ${store.name}`,
          currentValue: store.monthlySales,
          suggestedValue: 0,
          autoFixable: false
        });
      }
    });

    // Verificar inconsistências nos produtos
    products.forEach(product => {
      // Verificar margem de lucro negativa
      if (product.sellingPrice < product.costPrice) {
        inconsistencies.push({
          id: `negative-margin-${product.id}`,
          type: 'calculation_error',
          severity: 'high',
          description: `Margem de lucro negativa para ${product.name}`,
          affectedEntity: `Produto: ${product.name}`,
          currentValue: `Custo: ${product.costPrice}, Venda: ${product.sellingPrice}`,
          suggestedValue: `Revisar preços`,
          autoFixable: false
        });
      }

      // Verificar produtos com data de entrada posterior à data de vencimento
      if (new Date(product.entryDate) > new Date(product.expiryDate)) {
        inconsistencies.push({
          id: `invalid-dates-${product.id}`,
          type: 'data_mismatch',
          severity: 'critical',
          description: `Data de entrada posterior ao vencimento para ${product.name}`,
          affectedEntity: `Produto: ${product.name}`,
          currentValue: `Entrada: ${product.entryDate}, Vencimento: ${product.expiryDate}`,
          suggestedValue: `Corrigir datas`,
          autoFixable: false
        });
      }

      // Verificar produtos já vencidos
      const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 0) {
        inconsistencies.push({
          id: `expired-product-${product.id}`,
          type: 'outdated_info',
          severity: 'critical',
          description: `Produto vencido: ${product.name}`,
          affectedEntity: `Produto: ${product.name}`,
          currentValue: product.expiryDate,
          suggestedValue: `Remover ou atualizar`,
          autoFixable: false
        });
      }
    });

    return inconsistencies;
  };

  const calculateDataQualityScore = (inconsistencies: SystemInconsistency[]): number => {
    const totalEntities = getAllStores().length + getAllProducts().length;
    const criticalIssues = inconsistencies.filter(i => i.severity === 'critical').length;
    const highIssues = inconsistencies.filter(i => i.severity === 'high').length;
    const mediumIssues = inconsistencies.filter(i => i.severity === 'medium').length;
    const lowIssues = inconsistencies.filter(i => i.severity === 'low').length;

    const weightedIssues = (criticalIssues * 4) + (highIssues * 3) + (mediumIssues * 2) + (lowIssues * 1);
    const maxPossibleIssues = totalEntities * 4;
    
    return Math.max(0, Math.min(100, 100 - (weightedIssues / maxPossibleIssues) * 100));
  };

  const generateRecommendations = (inconsistencies: SystemInconsistency[]): string[] => {
    const recommendations = [];

    const criticalCount = inconsistencies.filter(i => i.severity === 'critical').length;
    const autoFixableCount = inconsistencies.filter(i => i.autoFixable).length;

    if (criticalCount > 0) {
      recommendations.push(`Resolver ${criticalCount} problemas críticos imediatamente`);
    }

    if (autoFixableCount > 0) {
      recommendations.push(`${autoFixableCount} problemas podem ser corrigidos automaticamente`);
    }

    const expiredProducts = inconsistencies.filter(i => i.id.includes('expired-product')).length;
    if (expiredProducts > 0) {
      recommendations.push(`Remover ou atualizar ${expiredProducts} produtos vencidos`);
    }

    const negativeMargins = inconsistencies.filter(i => i.id.includes('negative-margin')).length;
    if (negativeMargins > 0) {
      recommendations.push(`Revisar preços de ${negativeMargins} produtos com margem negativa`);
    }

    recommendations.push('Implementar sincronização automática diária');
    recommendations.push('Configurar alertas para inconsistências críticas');

    return recommendations;
  };

  const runCompleteAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular análise complexa
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const inconsistencies = detectInconsistencies();
      const dataQualityScore = calculateDataQualityScore(inconsistencies);
      const recommendations = generateRecommendations(inconsistencies);
      
      const report: SystemAnalysisReport = {
        totalInconsistencies: inconsistencies.length,
        criticalIssues: inconsistencies.filter(i => i.severity === 'critical').length,
        dataQualityScore,
        lastSyncDate: new Date(),
        recommendations,
        inconsistencies
      };

      setAnalysisReport(report);
      toast.success(`Análise concluída! ${inconsistencies.length} inconsistências encontradas`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const syncSystemData = async () => {
    setIsSyncing(true);
    
    try {
      const stores = getAllStores();
      const products = getAllProducts();
      let fixedCount = 0;

      // Corrigir estatísticas das lojas
      for (const store of stores) {
        const storeProducts = products.filter(p => p.storeId === store.id);
        
        const actualCriticalStock = storeProducts.filter(p => p.quantity < 5).length;
        const actualExpiringProducts = storeProducts.filter(p => {
          const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
        }).length;

        if (store.criticalStock !== actualCriticalStock || store.expiringProducts !== actualExpiringProducts) {
          const updatedStore: Store = {
            ...store,
            criticalStock: actualCriticalStock,
            expiringProducts: actualExpiringProducts
          };
          
          updateStore(updatedStore);
          fixedCount++;
        }
      }

      // Simular sincronização
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Sincronização concluída! ${fixedCount} registros corrigidos`);
      
      // Re-executar análise após sincronização
      await runCompleteAnalysis();
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Executar análise inicial
    runCompleteAnalysis();
  }, []);

  return {
    analysisReport,
    isAnalyzing,
    isSyncing,
    runCompleteAnalysis,
    syncSystemData
  };
};
