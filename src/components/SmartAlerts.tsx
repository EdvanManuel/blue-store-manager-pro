
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, TrendingUp, TrendingDown, Package, Calendar, DollarSign, X } from 'lucide-react';
import { getAllProducts, getAllStores } from '@/data/storeData';

interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  storeId?: number;
  productId?: number;
  priority: number;
}

const SmartAlerts = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  const generateAlerts = () => {
    const stores = getAllStores();
    const products = getAllProducts();
    const newAlerts: AlertItem[] = [];

    // Critical stock alerts
    const criticalStock = products.filter(p => p.quantity < 5);
    criticalStock.forEach(product => {
      const store = stores.find(s => s.id === product.storeId);
      newAlerts.push({
        id: `critical-stock-${product.id}`,
        type: 'critical',
        title: 'Estoque Crítico',
        description: `${product.name} tem apenas ${product.quantity} unidades restantes na ${store?.name}`,
        action: 'Reabastecer',
        storeId: product.storeId,
        productId: product.id,
        priority: 1
      });
    });

    // Expiring products alerts
    const expiringProducts = products.filter(p => {
      const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
    });
    
    expiringProducts.forEach(product => {
      const store = stores.find(s => s.id === product.storeId);
      const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      newAlerts.push({
        id: `expiring-${product.id}`,
        type: daysUntilExpiry <= 7 ? 'critical' : 'warning',
        title: 'Produto Próximo ao Vencimento',
        description: `${product.name} expira em ${daysUntilExpiry} dias na ${store?.name}`,
        action: 'Promover',
        storeId: product.storeId,
        productId: product.id,
        priority: daysUntilExpiry <= 7 ? 1 : 2
      });
    });

    // Performance alerts
    stores.forEach(store => {
      if (store.monthlySales < 80000) {
        newAlerts.push({
          id: `low-sales-${store.id}`,
          type: 'warning',
          title: 'Vendas Abaixo do Esperado',
          description: `${store.name} teve vendas de ${store.monthlySales.toLocaleString('pt-BR')} Kz este mês`,
          action: 'Analisar',
          storeId: store.id,
          priority: 3
        });
      }

      if (store.monthlySales > 200000) {
        newAlerts.push({
          id: `high-performance-${store.id}`,
          type: 'success',
          title: 'Excelente Performance',
          description: `${store.name} superou expectativas com ${store.monthlySales.toLocaleString('pt-BR')} Kz`,
          storeId: store.id,
          priority: 4
        });
      }
    });

    // Inventory value alerts
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    if (totalInventoryValue > 1000000) {
      newAlerts.push({
        id: 'high-inventory-value',
        type: 'info',
        title: 'Alto Valor em Estoque',
        description: `Valor total do estoque: ${totalInventoryValue.toLocaleString('pt-BR')} Kz`,
        action: 'Otimizar',
        priority: 5
      });
    }

    setAlerts(newAlerts.sort((a, b) => a.priority - b.priority));
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set(prev).add(alertId));
  };

  const getAlertIcon = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'info':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'success':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: AlertItem['type']) => {
    switch (type) {
      case 'critical':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      case 'success':
        return 'default';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    generateAlerts();
    const interval = setInterval(generateAlerts, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Sistema Funcionando Perfeitamente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Não há alertas críticos no momento. Seu sistema está operando de forma eficiente!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Alertas Inteligentes</h3>
        <Badge variant="outline">
          {visibleAlerts.length} {visibleAlerts.length === 1 ? 'alerta' : 'alertas'}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {visibleAlerts.map((alert) => (
          <Alert 
            key={alert.id} 
            variant={getAlertVariant(alert.type)}
            className="relative"
          >
            <div className="flex items-start gap-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 space-y-1">
                <AlertTitle className="text-sm font-medium">
                  {alert.title}
                </AlertTitle>
                <AlertDescription className="text-sm">
                  {alert.description}
                </AlertDescription>
                {alert.action && (
                  <Button size="sm" variant="outline" className="mt-2">
                    {alert.action}
                  </Button>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => dismissAlert(alert.id)}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>
    </div>
  );
};

export default SmartAlerts;
