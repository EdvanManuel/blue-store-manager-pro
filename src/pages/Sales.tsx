
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Plus, Minus, Trash2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { getAllStores, getProductsByStoreId, Store, Product } from "@/data/storeData";

interface SaleItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  discount: number;
  total: number;
}

interface Sale {
  id: number;
  storeId: number;
  storeName: string;
  items: SaleItem[];
  subtotal: number;
  totalDiscount: number;
  finalTotal: number;
  paymentMethod: string;
  customerName: string;
  customerPhone: string;
  saleDate: string;
  status: 'pending' | 'completed' | 'cancelled';
}

const Sales = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("dinheiro");
  const [sales, setSales] = useState<Sale[]>([]);

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

  const addProductToSale = (product: Product) => {
    const existingItem = saleItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      setSaleItems(prev => prev.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice * (1 - item.discount / 100) }
          : item
      ));
    } else {
      const newItem: SaleItem = {
        productId: product.id,
        productName: product.name,
        unitPrice: product.sellingPrice,
        quantity: 1,
        discount: 0,
        total: product.sellingPrice
      };
      setSaleItems(prev => [...prev, newItem]);
    }
    toast.success(`${product.name} adicionado à venda`);
  };

  const updateItemQuantity = (productId: number, change: number) => {
    setSaleItems(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
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
    const finalTotal = subtotal - totalDiscount;
    
    return { subtotal, totalDiscount, finalTotal };
  };

  const completeSale = () => {
    if (!selectedStoreId || saleItems.length === 0) {
      toast.error("Selecione uma loja e adicione produtos à venda");
      return;
    }

    const selectedStore = stores.find(store => store.id === Number(selectedStoreId));
    const { subtotal, totalDiscount, finalTotal } = calculateTotals();

    const newSale: Sale = {
      id: Date.now(),
      storeId: Number(selectedStoreId),
      storeName: selectedStore?.name || "",
      items: [...saleItems],
      subtotal,
      totalDiscount,
      finalTotal,
      paymentMethod,
      customerName,
      customerPhone,
      saleDate: new Date().toISOString(),
      status: 'completed'
    };

    setSales(prev => [newSale, ...prev]);
    
    // Reset form
    setSaleItems([]);
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod("dinheiro");
    
    toast.success(`Venda processada com sucesso! Total: ${finalTotal.toFixed(2)} Kz`);
  };

  const { subtotal, totalDiscount, finalTotal } = calculateTotals();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-dark">
          Processamento de Vendas
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Sale Processing */}
        <div className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Nome do Cliente</Label>
                  <Input
                    id="customer"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nome (opcional)"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Telefone (opcional)"
                  />
                </div>
              </div>

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
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">
                          {product.sellingPrice.toLocaleString('pt-BR')} Kz | Estoque: {product.quantity}
                        </p>
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

        {/* Right Panel - Current Sale */}
        <div className="space-y-6">
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
                        <h4 className="font-medium">{item.productName}</h4>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItemFromSale(item.productId)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div>
                          <Label className="text-xs">Quantidade</Label>
                          <div className="flex items-center mt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateItemQuantity(item.productId, -1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="mx-2 font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
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
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label className="text-xs">Total</Label>
                          <div className="mt-1 font-medium">
                            {item.total.toFixed(2)} Kz
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{subtotal.toFixed(2)} Kz</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Desconto Total:</span>
                      <span>-{totalDiscount.toFixed(2)} Kz</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Final:</span>
                      <span>{finalTotal.toFixed(2)} Kz</span>
                    </div>
                  </div>

                  <Button 
                    onClick={completeSale} 
                    className="w-full"
                    size="lg"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Finalizar Venda
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Sales */}
          {sales.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vendas Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {sales.slice(0, 5).map((sale) => (
                    <div key={sale.id} className="border p-2 rounded text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{sale.storeName}</span>
                        <span className="font-bold">{sale.finalTotal.toFixed(2)} Kz</span>
                      </div>
                      <div className="text-gray-500">
                        {sale.customerName && <span>{sale.customerName} | </span>}
                        {sale.items.length} item(s) | {sale.paymentMethod}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(sale.saleDate).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
