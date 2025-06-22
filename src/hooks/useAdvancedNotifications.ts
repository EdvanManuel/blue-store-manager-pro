
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { getAllProducts, getAllStores } from '@/data/storeData';

export interface AdvancedNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  category: 'stock' | 'sales' | 'products' | 'expiry' | 'trends';
  title: string;
  message: string;
  timestamp: Date;
  storeId?: number;
  productId?: number;
  action?: () => void;
  actionLabel?: string;
  priority: 'high' | 'medium' | 'low';
}

export const useAdvancedNotifications = () => {
  const [notifications, setNotifications] = useState<AdvancedNotification[]>([]);

  const checkCriticalStock = () => {
    const products = getAllProducts();
    const stores = getAllStores();
    const alerts: AdvancedNotification[] = [];

    products.forEach(product => {
      const store = stores.find(s => s.id === product.storeId);
      
      if (product.quantity === 0) {
        alerts.push({
          id: `out-of-stock-${product.id}-${Date.now()}`,
          type: 'critical',
          category: 'stock',
          title: 'Produto Esgotado',
          message: `${product.name} está sem estoque na ${store?.name}`,
          timestamp: new Date(),
          storeId: product.storeId,
          productId: product.id,
          priority: 'high'
        });
      } else if (product.quantity <= 5) {
        alerts.push({
          id: `low-stock-${product.id}-${Date.now()}`,
          type: 'warning',
          category: 'stock',
          title: 'Estoque Crítico',
          message: `${product.name} tem apenas ${product.quantity} unidades na ${store?.name}`,
          timestamp: new Date(),
          storeId: product.storeId,
          productId: product.id,
          priority: 'high'
        });
      }
    });

    return alerts;
  };

  const checkProductExpiry = () => {
    const products = getAllProducts();
    const stores = getAllStores();
    const alerts: AdvancedNotification[] = [];

    products.forEach(product => {
      const store = stores.find(s => s.id === product.storeId);
      const expiryDate = new Date(product.expiryDate);
      const today = new Date();
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry <= 0) {
        alerts.push({
          id: `expired-${product.id}-${Date.now()}`,
          type: 'critical',
          category: 'expiry',
          title: 'Produto Vencido',
          message: `${product.name} venceu na ${store?.name}`,
          timestamp: new Date(),
          storeId: product.storeId,
          productId: product.id,
          priority: 'high'
        });
      } else if (daysUntilExpiry <= 7) {
        alerts.push({
          id: `expiring-soon-${product.id}-${Date.now()}`,
          type: 'warning',
          category: 'expiry',
          title: 'Produto Próximo ao Vencimento',
          message: `${product.name} vence em ${daysUntilExpiry} dias na ${store?.name}`,
          timestamp: new Date(),
          storeId: product.storeId,
          productId: product.id,
          priority: 'medium'
        });
      } else if (daysUntilExpiry <= 30) {
        alerts.push({
          id: `expiring-month-${product.id}-${Date.now()}`,
          type: 'info',
          category: 'expiry',
          title: 'Validade em 30 Dias',
          message: `${product.name} vence em ${daysUntilExpiry} dias na ${store?.name}`,
          timestamp: new Date(),
          storeId: product.storeId,
          productId: product.id,
          priority: 'low'
        });
      }
    });

    return alerts;
  };

  const checkTrendingProducts = () => {
    const products = getAllProducts();
    const alerts: AdvancedNotification[] = [];

    // Simulate trending logic based on high margins and stock levels
    const trendingProducts = products.filter(product => {
      const margin = ((product.sellingPrice - product.costPrice) / product.costPrice) * 100;
      return margin > 40 && product.quantity > 20;
    }).sort((a, b) => {
      const marginA = ((a.sellingPrice - a.costPrice) / a.costPrice) * 100;
      const marginB = ((b.sellingPrice - b.costPrice) / b.costPrice) * 100;
      return marginB - marginA;
    }).slice(0, 3);

    if (trendingProducts.length > 0) {
      alerts.push({
        id: `trending-products-${Date.now()}`,
        type: 'success',
        category: 'trends',
        title: 'Produtos em Alta',
        message: `${trendingProducts.length} produtos com alto desempenho identificados`,
        timestamp: new Date(),
        priority: 'medium'
      });
    }

    return alerts;
  };

  const checkStagnantStock = () => {
    const products = getAllProducts();
    const stores = getAllStores();
    const alerts: AdvancedNotification[] = [];

    // Simulate stagnant stock logic - products with low margins and high quantity
    products.forEach(product => {
      const store = stores.find(s => s.id === product.storeId);
      const margin = ((product.sellingPrice - product.costPrice) / product.costPrice) * 100;
      
      if (margin < 15 && product.quantity > 50) {
        alerts.push({
          id: `stagnant-${product.id}-${Date.now()}`,
          type: 'warning',
          category: 'stock',
          title: 'Estoque Parado',
          message: `${product.name} tem alta quantidade e baixa margem na ${store?.name}`,
          timestamp: new Date(),
          storeId: product.storeId,
          productId: product.id,
          priority: 'medium'
        });
      }
    });

    return alerts;
  };

  const simulateSalesNotifications = () => {
    const alerts: AdvancedNotification[] = [];
    
    // Simulate a sale notification
    if (Math.random() > 0.8) { // 20% chance
      alerts.push({
        id: `sale-completed-${Date.now()}`,
        type: 'success',
        category: 'sales',
        title: 'Venda Realizada',
        message: 'Nova venda processada com sucesso',
        timestamp: new Date(),
        priority: 'low'
      });
    }

    return alerts;
  };

  const runAdvancedAnalysis = () => {
    const criticalStockAlerts = checkCriticalStock();
    const expiryAlerts = checkProductExpiry();
    const trendingAlerts = checkTrendingProducts();
    const stagnantAlerts = checkStagnantStock();
    const salesAlerts = simulateSalesNotifications();

    const allAlerts = [
      ...criticalStockAlerts,
      ...expiryAlerts,
      ...trendingAlerts,
      ...stagnantAlerts,
      ...salesAlerts
    ];

    setNotifications(prev => {
      const existingIds = prev.map(n => n.id);
      const newAlerts = allAlerts.filter(alert => !existingIds.includes(alert.id));
      return [...prev, ...newAlerts].slice(-50); // Keep only the 50 most recent
    });

    // Show toast for high priority notifications
    allAlerts.filter(alert => alert.priority === 'high').forEach(alert => {
      if (alert.type === 'critical') {
        toast.error(alert.title, {
          description: alert.message,
          action: alert.action ? {
            label: alert.actionLabel || 'Ver',
            onClick: alert.action
          } : undefined
        });
      } else if (alert.type === 'warning') {
        toast.warning(alert.title, {
          description: alert.message
        });
      }
    });
  };

  useEffect(() => {
    // Run analysis immediately
    runAdvancedAnalysis();

    // Run analysis every 2 minutes
    const interval = setInterval(runAdvancedAnalysis, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByCategory = (category: string) => {
    return notifications.filter(n => n.category === category);
  };

  const getNotificationsByPriority = (priority: 'high' | 'medium' | 'low') => {
    return notifications.filter(n => n.priority === priority);
  };

  return {
    notifications,
    dismissNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByPriority,
    runAdvancedAnalysis
  };
};
