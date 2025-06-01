
import { Store, Product, getAllStores, getAllProducts } from '@/data/storeData';

export interface Recommendation {
  id: string;
  type: 'restock' | 'promotion' | 'optimization' | 'expansion';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  action: string;
  storeId?: number;
  productId?: number;
  estimatedRevenue?: number;
}

export const generateSmartRecommendations = (): Recommendation[] => {
  const stores = getAllStores();
  const products = getAllProducts();
  const recommendations: Recommendation[] = [];

  // 1. Restock recommendations for critical products
  const criticalProducts = products.filter(p => p.quantity < 5);
  criticalProducts.forEach(product => {
    const store = stores.find(s => s.id === product.storeId);
    const estimatedRevenue = (product.sellingPrice - product.costPrice) * 20; // Assume restocking 20 units
    
    recommendations.push({
      id: `restock-${product.id}`,
      type: 'restock',
      priority: product.quantity === 0 ? 'high' : 'medium',
      title: `Reabastecer ${product.name}`,
      description: `Produto com estoque crítico (${product.quantity} unidades) na ${store?.name}`,
      impact: `Evitar perda de vendas e manter satisfação do cliente`,
      action: 'Fazer pedido de reposição urgente',
      storeId: product.storeId,
      productId: product.id,
      estimatedRevenue
    });
  });

  // 2. Promotion recommendations for products close to expiry
  const expiringProducts = products.filter(p => {
    const daysUntilExpiry = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0 && p.quantity > 0;
  });

  expiringProducts.forEach(product => {
    const store = stores.find(s => s.id === product.storeId);
    const daysUntilExpiry = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const discountRevenue = product.sellingPrice * 0.7 * product.quantity; // 30% discount
    
    recommendations.push({
      id: `promotion-${product.id}`,
      type: 'promotion',
      priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
      title: `Promoção para ${product.name}`,
      description: `Produto expira em ${daysUntilExpiry} dias na ${store?.name}`,
      impact: `Recuperar investimento antes do vencimento`,
      action: `Aplicar desconto de 30% para liquidação rápida`,
      storeId: product.storeId,
      productId: product.id,
      estimatedRevenue: discountRevenue
    });
  });

  // 3. Store optimization recommendations
  stores.forEach(store => {
    const storeProducts = products.filter(p => p.storeId === store.id);
    const totalInventoryValue = storeProducts.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);
    const profitMargin = storeProducts.reduce((sum, p) => sum + ((p.sellingPrice - p.costPrice) * p.quantity), 0);

    // Low performance stores
    if (store.monthlySales < 100000) {
      recommendations.push({
        id: `optimize-${store.id}`,
        type: 'optimization',
        priority: 'medium',
        title: `Otimizar Performance da ${store.name}`,
        description: `Vendas abaixo da média (${store.monthlySales.toLocaleString('pt-BR')} Kz)`,
        impact: `Potencial aumento de 20-30% nas vendas`,
        action: 'Revisar mix de produtos e estratégias de marketing',
        storeId: store.id,
        estimatedRevenue: store.monthlySales * 0.25
      });
    }

    // High inventory value with low turnover
    if (totalInventoryValue > 500000 && store.monthlySales < totalInventoryValue * 0.2) {
      recommendations.push({
        id: `inventory-opt-${store.id}`,
        type: 'optimization',
        priority: 'medium',
        title: `Otimizar Giro de Estoque da ${store.name}`,
        description: `Alto valor em estoque com baixo giro (${totalInventoryValue.toLocaleString('pt-BR')} Kz)`,
        impact: `Liberar capital de giro e reduzir custos`,
        action: 'Implementar estratégias de rotação de estoque',
        storeId: store.id,
        estimatedRevenue: totalInventoryValue * 0.1
      });
    }
  });

  // 4. Expansion recommendations for high-performing stores
  const highPerformingStores = stores.filter(s => s.monthlySales > 180000);
  highPerformingStores.forEach(store => {
    recommendations.push({
      id: `expand-${store.id}`,
      type: 'expansion',
      priority: 'low',
      title: `Oportunidade de Expansão para ${store.name}`,
      description: `Loja com excelente performance (${store.monthlySales.toLocaleString('pt-BR')} Kz/mês)`,
      impact: `Replicar sucesso em novas localizações`,
      action: 'Considerar abertura de filial ou expansão do espaço',
      storeId: store.id,
      estimatedRevenue: store.monthlySales * 0.8 // Estimate for new location
    });
  });

  // 5. Category optimization recommendations
  const categoryPerformance = new Map<string, { totalRevenue: number, totalCost: number, count: number }>();
  
  products.forEach(product => {
    const revenue = product.sellingPrice * product.quantity;
    const cost = product.costPrice * product.quantity;
    
    if (categoryPerformance.has(product.category)) {
      const current = categoryPerformance.get(product.category)!;
      categoryPerformance.set(product.category, {
        totalRevenue: current.totalRevenue + revenue,
        totalCost: current.totalCost + cost,
        count: current.count + 1
      });
    } else {
      categoryPerformance.set(product.category, {
        totalRevenue: revenue,
        totalCost: cost,
        count: 1
      });
    }
  });

  // Find low-performing categories
  categoryPerformance.forEach((performance, category) => {
    const margin = ((performance.totalRevenue - performance.totalCost) / performance.totalRevenue) * 100;
    
    if (margin < 20 && performance.count > 3) {
      recommendations.push({
        id: `category-opt-${category}`,
        type: 'optimization',
        priority: 'low',
        title: `Otimizar Categoria "${category}"`,
        description: `Categoria com baixa margem de lucro (${margin.toFixed(1)}%)`,
        impact: `Melhorar rentabilidade da categoria`,
        action: 'Revisar fornecedores ou ajustar preços',
        estimatedRevenue: performance.totalRevenue * 0.1
      });
    }
  });

  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

export const getRecommendationsByStore = (storeId: number): Recommendation[] => {
  return generateSmartRecommendations().filter(rec => rec.storeId === storeId);
};

export const getRecommendationsByType = (type: Recommendation['type']): Recommendation[] => {
  return generateSmartRecommendations().filter(rec => rec.type === type);
};

export const calculateTotalPotentialRevenue = (): number => {
  return generateSmartRecommendations()
    .filter(rec => rec.estimatedRevenue)
    .reduce((sum, rec) => sum + (rec.estimatedRevenue || 0), 0);
};
