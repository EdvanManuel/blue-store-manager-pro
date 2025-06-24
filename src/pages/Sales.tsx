import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Plus, Minus, Trash2, Receipt, FileText, Printer } from "lucide-react";
import { toast } from "sonner";
import { getAllStores, getProductsByStoreId, updateProduct, Store, Product } from "@/data/storeData";
import { useAutomaticInvoicing, InvoiceData, DocumentType } from "@/hooks/useAutomaticInvoicing";
import { Badge } from "@/components/ui/badge";
import CommercialInvoiceTemplate from "@/components/CommercialInvoiceTemplate";
import CustomerSelector from "@/components/CustomerSelector";
import DocumentTypeSelector from "@/components/DocumentTypeSelector";
import { useCustomerManagement, Customer } from "@/hooks/useCustomerManagement";

interface SaleItem {
  productId: number;
  productName: string;
  productCode: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
  availableStock: number;
}

interface Sale {
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
  documentType: DocumentType;
  invoiceNumber: string;
}

const Sales = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>('factura');
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [sales, setSales] = useState<Sale[]>([]);
  
  const { invoices, generateInvoice, printInvoice } = useAutomaticInvoicing();
  const { getCustomerById } = useCustomerManagement();

  useEffect(() => {
    const allStores = getAllStores();
    setStores(allStores);
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      const storeProducts = getProductsByStoreId(Number(selectedStoreId));
      setProducts(storeProducts);
    }
  }, [selectedStoreId]);

  const validateStockAvailability = (productId: number, requestedQuantity: number): boolean => {
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
  };

  const updateProductStock = (productId: number, quantitySold: number) => {
    const product = products.find(p => p.id === productId);
    
    if (product) {
      const updatedProduct = {
        ...product,
        quantity: product.quantity - quantitySold
      };
      updateProduct(updatedProduct);
    }
  };

  const addProductToSale = (product: Product) => {
    const existingItem = saleItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      if (existingItem.quantity >= product.quantity) {
        toast.error(`Estoque insuficiente. Disponível: ${product.quantity} unidades`);
        return;
      }
      setSaleItems(prev => prev.map(item => 
        item.productId === product.id 
          ? { 
              ...item, 
              quantity: item.quantity + 1, 
              total: (item.quantity + 1) * item.unitPrice * (1 - item.discount / 100) 
            }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        productCode: product.code,
        unitPrice: product.sellingPrice,
        quantity: 1,
        discount: 0,
        total: product.sellingPrice,
        availableStock: product.quantity
      };
      setSaleItems(prev => [...prev, newItem]);
    }
    toast.success(`${product.name} adicionado à venda`);
  };

  const updateItemQuantity = (productId: number, change: number) => {
    setSaleItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, Math.min(item.availableStock, item.quantity + change));
        if (newQuantity > item.availableStock) {
          toast.error(`Estoque máximo: ${item.availableStock} unidades`);
          return item;
        }
        return {
          ...item,
          quantity: newQuantity,
          total: newQuantity * item.unitPrice * (1 - item.discount / 100)
        };
      }
      return item;
    }));
  };

  const updateItemDiscount = (productId: number, discount: number) => {
    setSaleItems(prev => prev.map(item => {
      if (item.productId === productId) {
        return {
          ...item,
          discount,
          total: item.quantity * item.unitPrice * (1 - discount / 100)
        };
      }
      return item;
    }));
  };

  const removeItemFromSale = (productId: number) => {
    setSaleItems(prev => prev.filter(item => item.productId !== productId));
    toast.success("Item removido da venda");
  };

  const calculateTotals = () => {
    const subtotal = saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const totalDiscount = saleItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.discount / 100), 0);
    const tax = (subtotal - totalDiscount) * 0.14; // 14% IVA
    const finalTotal = subtotal - totalDiscount + tax;
    
    return { subtotal, totalDiscount, tax, finalTotal };
  };

  const completeSale = () => {
    if (!selectedStoreId || saleItems.length === 0) {
      toast.error("Selecione uma loja e adicione produtos à venda");
      return;
    }

    // Validar estoque para todos os itens
    for (const item of saleItems) {
      if (!validateStockAvailability(item.productId, item.quantity)) {
        return;
      }
    }

    const selectedStore = stores.find(store => store.id === Number(selectedStoreId));
    const { subtotal, totalDiscount, tax, finalTotal } = calculateTotals();

    // Atualizar estoque
    saleItems.forEach(item => {
      updateProductStock(item.productId, item.quantity);
    });

    // Gerar documento automaticamente com o tipo selecionado
    const invoice = generateInvoice({
      documentType: selectedDocumentType,
      storeName: selectedStore?.name || "",
      customerName: selectedCustomer?.name || "Cliente Diverso",
      customerPhone: selectedCustomer?.phone || "",
      customerAddress: selectedCustomer?.address || "",
      customerTaxNumber: selectedCustomer?.taxNumber || "",
      items: saleItems.map(item => ({
        productCode: item.productCode,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total: item.total
      })),
      subtotal,
      tax,
      finalTotal
    });

    const newSale: Sale = {
      id: Date.now(),
      storeId: Number(selectedStoreId),
      storeName: selectedStore?.name || "",
      items: [...saleItems],
      subtotal,
      totalDiscount,
      tax,
      finalTotal,
      paymentMethod,
      customerName: selectedCustomer?.name || "Cliente Diverso",
      customerPhone: selectedCustomer?.phone || "",
      saleDate: new Date().toISOString(),
      status: 'completed',
      documentType: selectedDocumentType,
      invoiceNumber: invoice.invoiceNumber
    };

    setSales(prev => [newSale, ...prev]);
    
    // Reset form
    setSaleItems([]);
    setSelectedCustomer(null);
    setPaymentMethod("dinheiro");
    // Manter o tipo de documento selecionado para próximas vendas
    
    // Refresh products to show updated stock
    const storeProducts = getProductsByStoreId(Number(selectedStoreId));
    setProducts(storeProducts);
    
    const documentNames = {
      factura: 'Fatura',
      recibo: 'Recibo',
      credito: 'Nota de Crédito',
      debito: 'Nota de Débito',
      proforma: 'Fatura Pró-forma',
      devolucao: 'Nota de Devolução'
    };
    
    toast.success(`Venda processada com sucesso! Total: ${finalTotal.toFixed(2)} Kz`, {
      description: `${documentNames[selectedDocumentType]} ${invoice.invoiceNumber} gerada automaticamente`
    });
  };

  const handlePrintInvoice = (invoiceNumber: string) => {
    const invoice = invoices.find(inv => inv.invoiceNumber === invoiceNumber);
    if (invoice) {
      printInvoice(invoice);
    }
  };

  const { subtotal, totalDiscount, tax, finalTotal } = calculateTotals();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-dark">
          Sistema de Vendas e Faturação
        </h1>
      </div>

      <Tabs defaultValue="sales" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Vendas Rápidas
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Template de Fatura Comercial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Panel - Sale Processing */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Nova Venda</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store">Loja</Label>
                    <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma loja" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((store) => (
                          <SelectItem key={store.id} value={store.id.toString()}>
                            {store.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <CustomerSelector
                    selectedCustomer={selectedCustomer}
                    onCustomerSelect={setSelectedCustomer}
                  />

                  <DocumentTypeSelector
                    selectedType={selectedDocumentType}
                    onTypeSelect={setSelectedDocumentType}
                  />

                  <div className="space-y-2">
                    <Label>Método de Pagamento</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="transferencia">Transferência Bancária</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="multicaixa">Multicaixa Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Available Products */}
              {selectedStoreId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Produtos Disponíveis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-2 border rounded hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              {product.sellingPrice.toLocaleString('pt-BR')} Kz
                            </p>
                            <Badge variant={product.quantity < 5 ? "destructive" : "secondary"} className="text-xs">
                              Estoque: {product.quantity}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addProductToSale(product)}
                            disabled={product.quantity === 0}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Middle Panel - Current Sale */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Carrinho de Venda</CardTitle>
                </CardHeader>
                <CardContent>
                  {saleItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum item adicionado à venda
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {saleItems.map((item) => (
                        <div key={item.productId} className="border p-3 rounded">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{item.productName}</h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItemFromSale(item.productId)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 items-center text-sm">
                            <div>
                              <Label className="text-xs">Quantidade</Label>
                              <div className="flex items-center mt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 p-0"
                                  onClick={() => updateItemQuantity(item.productId, -1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="mx-2 font-medium">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 w-6 p-0"
                                  onClick={() => updateItemQuantity(item.productId, 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs">Desconto %</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={(e) => updateItemDiscount(item.productId, Number(e.target.value))}
                                className="mt-1 h-6 text-xs"
                              />
                            </div>
                          </div>
                          
                          <div className="mt-2 text-right">
                            <span className="font-medium text-sm">
                              {item.total.toFixed(2)} Kz
                            </span>
                          </div>
                        </div>
                      ))}

                      {/* Totals */}
                      <div className="border-t pt-4 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>{subtotal.toFixed(2)} Kz</span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Desconto:</span>
                          <span>-{totalDiscount.toFixed(2)} Kz</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IVA (14%):</span>
                          <span>{tax.toFixed(2)} Kz</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>{finalTotal.toFixed(2)} Kz</span>
                        </div>
                      </div>

                      <Button 
                        onClick={completeSale} 
                        className="w-full"
                        size="lg"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Finalizar Venda + Gerar {selectedDocumentType === 'factura' ? 'Fatura' : 
                                            selectedDocumentType === 'recibo' ? 'Recibo' :
                                            selectedDocumentType === 'credito' ? 'Nota de Crédito' :
                                            selectedDocumentType === 'debito' ? 'Nota de Débito' :
                                            selectedDocumentType === 'proforma' ? 'Pró-forma' : 'Nota de Devolução'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Sales History */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Vendas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto space-y-3">
                    {sales.length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        Nenhuma venda realizada
                      </p>
                    ) : (
                      sales.map((sale) => (
                        <div key={sale.id} className="border p-3 rounded space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{sale.storeName}</h4>
                              <p className="text-xs text-gray-500">
                                {sale.customerName && <span>{sale.customerName} | </span>}
                                {sale.items.length} item(s)
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(sale.saleDate).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">{sale.finalTotal.toFixed(2)} Kz</p>
                              <Badge 
                                variant={
                                  sale.status === 'completed' ? 'default' : 
                                  sale.status === 'cancelled' ? 'destructive' : 
                                  'secondary'
                                }
                                className="text-xs"
                              >
                                {sale.status === 'completed' ? 'Concluída' : 
                                 sale.status === 'cancelled' ? 'Cancelada' : 
                                 'Pendente'}
                              </Badge>
                            </div>
                          </div>
                          
                          {sale.status === 'completed' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePrintInvoice(sale.invoiceNumber)}
                                className="flex-1 text-xs"
                              >
                                <Printer className="h-3 w-3 mr-1" />
                                Imprimir Fatura
                              </Button>
                            </div>
                          )}
                          
                          <p className="text-xs text-green-600">
                            Fatura: {sale.invoiceNumber}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoice" className="space-y-6">
          <CommercialInvoiceTemplate />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
