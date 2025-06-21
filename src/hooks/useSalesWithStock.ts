
import { useState, useCallback } from 'react';
import { 
  Product, 
  getAllProducts, 
  updateProduct, 
  getStoreById 
} from '@/data/storeData';
import { toast } from 'sonner';

export interface SaleItem {
  productId: number;
  productName: string;
  productCode: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
  availableStock: number;
}

export interface Sale {
  id: number;
  storeId: number;
  storeName: string;
  items: SaleItem[];
  subtotal: number;
  totalDiscount: number;
  tax: number;
  finalTotal: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  saleDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  invoiceGenerated: boolean;
  invoiceNumber?: string;
}

export const useSalesWithStock = () => {
  const [sales, setSales] = useState<Sale[]>([]);

  const validateStockAvailability = useCallback((productId: number, requestedQuantity: number): boolean => {
    const products = getAllProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
      toast.error('Produto não encontrado');
      return false;
    }
    
    if (product.quantity < requestedQuantity) {
      toast.error(`Estoque insuficiente. Disponível: ${product.quantity} unidades`);
      return false;
    }
    
    return true;
  }, []);

  const updateProductStock = useCallback((productId: number, quantitySold: number) => {
    const products = getAllProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity - quantitySold
      };
      updateProduct(updatedProduct);
    }
  }, []);

  const processSale = useCallback((saleData: Omit<Sale, 'id' | 'saleDate' | 'status' | 'invoiceGenerated'>) => {
    // Validar estoque para todos os itens
    for (const item of saleData.items) {
      if (!validateStockAvailability(item.productId, item.quantity)) {
        return null;
      }
    }

    // Atualizar estoque
    saleData.items.forEach(item => {
      updateProductStock(item.productId, item.quantity);
    });

    // Criar venda
    const newSale: Sale = {
      ...saleData,
      id: Date.now(),
      saleDate: new Date().toISOString(),
      status: 'completed',
      invoiceGenerated: false
    };

    setSales(prev => [newSale, ...prev]);
    
    toast.success(`Venda processada com sucesso! Total: ${newSale.finalTotal.toFixed(2)} Kz`, {
      description: `Estoque atualizado para ${newSale.items.length} produto(s)`
    });

    return newSale;
  }, [validateStockAvailability, updateProductStock]);

  const generateInvoiceFromSale = useCallback((saleId: number) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) {
      toast.error('Venda não encontrada');
      return null;
    }

    const invoiceNumber = `INV-${Date.now()}`;
    
    // Atualizar venda com número da fatura
    setSales(prev => prev.map(s => 
      s.id === saleId 
        ? { ...s, invoiceGenerated: true, invoiceNumber }
        : s
    ));

    // Retornar dados formatados para a fatura
    const invoiceData = {
      invoiceNumber,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      currency: 'AOA',
      companyName: sale.storeName,
      companyAddress: '',
      companyPhone: '',
      companyTaxNumber: '',
      clientName: sale.customerName || 'Cliente',
      clientAddress: '',
      clientPhone: sale.customerPhone || '',
      clientTaxNumber: '',
      products: sale.items.map(item => ({
        code: item.productCode,
        description: item.productName,
        quantity: item.quantity.toString(),
        unit: 'Un',
        unitPrice: item.unitPrice.toString(),
        discount: item.discount.toString(),
        tax: '14',
        total: item.total.toString()
      })),
      subtotal: sale.subtotal,
      tax: sale.tax,
      total: sale.finalTotal
    };

    toast.success(`Fatura ${invoiceNumber} gerada com sucesso!`);
    return invoiceData;
  }, [sales]);

  const cancelSale = useCallback((saleId: number) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) {
      toast.error('Venda não encontrada');
      return;
    }

    if (sale.status === 'cancelled') {
      toast.error('Venda já foi cancelada');
      return;
    }

    // Restaurar estoque
    sale.items.forEach(item => {
      const products = getAllProducts();
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const updatedProduct = {
          ...product,
          quantity: product.quantity + item.quantity
        };
        updateProduct(updatedProduct);
      }
    });

    // Atualizar status da venda
    setSales(prev => prev.map(s => 
      s.id === saleId 
        ? { ...s, status: 'cancelled' as const }
        : s
    ));

    toast.success('Venda cancelada e estoque restaurado');
  }, [sales]);

  return {
    sales,
    processSale,
    generateInvoiceFromSale,
    cancelSale,
    validateStockAvailability
  };
};
