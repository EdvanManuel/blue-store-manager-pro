
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAllProducts, getAllStores } from '@/data/storeData';

export interface SmartNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  action?: () => void;
  actionLabel?: string;
}

export const useSmartNotifications = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);

  const checkInventoryAlerts = () => {
    const products = getAllProducts();
    const alerts: SmartNotification[] = [];

    // Produtos com estoque baixo
    const lowStock = products.filter(p => p.quantity <= 5);
    if (lowStock.length > 0) {
      alerts.push({
        id: `low-stock-${Date.now()}`,
        type: 'critical',
        title: 'Estoque Crítico',
        message: `${lowStock.length} produto(s) com estoque baixo`,
        timestamp: new Date(),
        action: () => console.log('Navegando para inventário'),
        actionLabel: 'Ver Produtos'
      });
    }

    // Produtos próximos ao vencimento
    const expiringProducts = products.filter(p => {
      const expiryDate = new Date(p.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });

    if (expiringProducts.length > 0) {
      alerts.push({
        id: `expiring-${Date.now()}`,
        type: 'warning',
        title: 'Produtos Próximos ao Vencimento',
        message: `${expiringProducts.length} produto(s) vencem em até 30 dias`,
        timestamp: new Date(),
        action: () => console.log('Verificando validades'),
        actionLabel: 'Verificar'
      });
    }

    return alerts;
  };

  const checkPerformanceMetrics = () => {
    const stores = getAllStores();
    const products = getAllProducts();
    const alerts: SmartNotification[] = [];

    // Verificar performance das lojas
    const totalRevenue = stores.reduce((sum, store) => {
      const storeProducts = products.filter(p => p.storeId === store.id);
      return sum + storeProducts.reduce((pSum, product) => pSum + (product.sellingPrice * product.quantity), 0);
    }, 0);

    if (totalRevenue > 1000000) {
      alerts.push({
        id: `revenue-milestone-${Date.now()}`,
        type: 'success',
        title: 'Meta de Receita Atingida!',
        message: `Receita total excedeu 1M AOA: ${totalRevenue.toLocaleString()} AOA`,
        timestamp: new Date()
      });
    }

    // Sugestões de otimização
    const highMarginProducts = products.filter(p => {
      const margin = ((p.sellingPrice - p.costPrice) / p.costPrice) * 100;
      return margin > 50;
    });

    if (highMarginProducts.length > 10) {
      alerts.push({
        id: `optimization-${Date.now()}`,
        type: 'info',
        title: 'Oportunidade de Expansão',
        message: `${highMarginProducts.length} produtos com alta margem de lucro`,
        timestamp: new Date(),
        action: () => console.log('Expandir produtos rentáveis'),
        actionLabel: 'Ver Análise'
      });
    }

    return alerts;
  };

  const generateSmartRecommendations = () => {
    const products = getAllProducts();
    const alerts: SmartNotification[] = [];

    // Recomendações baseadas em padrões de vendas
    const topCategories = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.quantity;
      return acc;
    }, {} as Record<string, number>);

    const mostPopularCategory = Object.entries(topCategories)
      .sort(([,a], [,b]) => b - a)[0];

    if (mostPopularCategory) {
      alerts.push({
        id: `recommendation-${Date.now()}`,
        type: 'info',
        title: 'Recomendação Inteligente',
        message: `Categoria "${mostPopularCategory[0]}" tem alta demanda. Considere expandir o estoque.`,
        timestamp: new Date(),
        action: () => console.log('Expandir categoria popular'),
        actionLabel: 'Ver Detalhes'
      });
    }

    return alerts;
  };

  const runSmartAnalysis = () => {
    const inventoryAlerts = checkInventoryAlerts();
    const performanceAlerts = checkPerformanceMetrics();
    const recommendations = generateSmartRecommendations();

    const allAlerts = [...inventoryAlerts, ...performanceAlerts, ...recommendations];
    
    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const newAlerts = allAlerts.filter(alert => !existingIds.includes(alert.id));
      return [...prev, ...newAlerts].slice(-20); // Manter apenas os 20 mais recentes
    });

    // Mostrar toast para alertas críticos
    inventoryAlerts.filter(alert => alert.type === 'critical').forEach(alert => {
      toast.error(alert.title, {
        description: alert.message,
        action: alert.action ? {
          label: alert.actionLabel || 'Ação',
          onClick: alert.action
        } : undefined
      });
    });
  };

  useEffect(() => {
    // Executar análise inicial
    runSmartAnalysis();

    // Executar análise a cada 5 minutos
    const interval = setInterval(runSmartAnalysis, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    dismissNotification,
    clearAllNotifications,
    runSmartAnalysis
  };
};
