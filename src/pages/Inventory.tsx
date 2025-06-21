
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle, TrendingDown, Search, Filter } from "lucide-react";
import { getAllStores, getAllProducts, Store, Product, hasLowStock, isCloseToExpiry, daysUntilExpiry } from "@/data/storeData";
import { toast } from "sonner";

const Inventory = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    const allStores = getAllStores();
    const allProducts = getAllProducts();
    setStores(allStores);
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [selectedStoreId, searchTerm, filterType, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Filter by store
    if (selectedStoreId !== "all") {
      filtered = filtered.filter(product => product.storeId === Number(selectedStoreId));
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    switch (filterType) {
      case "low-stock":
        filtered = filtered.filter(product => hasLowStock(product.quantity));
        break;
      case "expiring":
        filtered = filtered.filter(product => isCloseToExpiry(product.expiryDate));
        break;
      case "out-of-stock":
        filtered = filtered.filter(product => product.quantity === 0);
        break;
    }

    setFilteredProducts(filtered);
  };

  const getInventoryStats = () => {
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const lowStock = products.filter(p => hasLowStock(p.quantity) && p.quantity > 0).length;
    const expiring = products.filter(p => isCloseToExpiry(p.expiryDate)).length;
    const totalValue = products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0);

    return { totalProducts, outOfStock, lowStock, expiring, totalValue };
  };

  const stats = getInventoryStats();

  const exportInventoryReport = () => {
    const csvContent = [
      ['Loja', 'Produto', 'Código', 'Categoria', 'Estoque', 'Preço Custo', 'Preço Venda', 'Valor Total', 'Status', 'Validade'].join(','),
      ...filteredProducts.map(product => {
        const store = stores.find(s => s.id === product.storeId);
        const status = product.quantity === 0 ? 'Sem Estoque' : 
                     hasLowStock(product.quantity) ? 'Estoque Baixo' : 
                     isCloseToExpiry(product.expiryDate) ? 'Próximo ao Vencimento' : 'Normal';
        return [
          store?.name || '',
          product.name,
          product.code,
          product.category,
          product.quantity,
          product.costPrice,
          product.sellingPrice,
          (product.costPrice * product.quantity).toFixed(2),
          status,
          new Date(product.expiryDate).toLocaleDateString('pt-BR')
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Relatório de inventário exportado com sucesso!");
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-dark">
            Gestão de Inventário
          </h1>
        </div>
        <Button onClick={exportInventoryReport}>
          Exportar Relatório
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Produtos</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sem Estoque</p>
                <p className="text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estoque Baixo</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowStock}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Próx. Vencimento</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.expiring}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalValue.toLocaleString('pt-BR')} Kz</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Pesquisar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Nome, código ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Loja</Label>
              <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as lojas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as lojas</SelectItem>
                  {stores.map((store) => (
                    <SelectItem key={store.id} value={store.id.toString()}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Filtro</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os produtos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os produtos</SelectItem>
                  <SelectItem value="low-stock">Estoque baixo</SelectItem>
                  <SelectItem value="out-of-stock">Sem estoque</SelectItem>
                  <SelectItem value="expiring">Próximo ao vencimento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedStoreId("all");
                setFilterType("all");
              }}>
                <Filter className="h-4 w-4 mr-2" />
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Loja</th>
                  <th className="text-left p-2">Produto</th>
                  <th className="text-left p-2">Código</th>
                  <th className="text-left p-2">Categoria</th>
                  <th className="text-right p-2">Estoque</th>
                  <th className="text-right p-2">Preço Custo</th>
                  <th className="text-right p-2">Preço Venda</th>
                  <th className="text-right p-2">Valor Total</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Validade</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const store = stores.find(s => s.id === product.storeId);
                  const totalValue = product.costPrice * product.quantity;
                  
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{store?.name}</td>
                      <td className="p-2 font-medium">{product.name}</td>
                      <td className="p-2">{product.code}</td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2 text-right">
                        <Badge variant={
                          product.quantity === 0 ? "destructive" : 
                          hasLowStock(product.quantity) ? "secondary" : 
                          "default"
                        }>
                          {product.quantity}
                        </Badge>
                      </td>
                      <td className="p-2 text-right">{product.costPrice.toLocaleString('pt-BR')} Kz</td>
                      <td className="p-2 text-right">{product.sellingPrice.toLocaleString('pt-BR')} Kz</td>
                      <td className="p-2 text-right">{totalValue.toLocaleString('pt-BR')} Kz</td>
                      <td className="p-2 text-center">
                        {product.quantity === 0 ? (
                          <Badge variant="destructive">Sem Estoque</Badge>
                        ) : hasLowStock(product.quantity) ? (
                          <Badge variant="secondary">Estoque Baixo</Badge>
                        ) : isCloseToExpiry(product.expiryDate) ? (
                          <Badge variant="outline">Próx. Vencimento</Badge>
                        ) : (
                          <Badge variant="default">Normal</Badge>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        <div className={
                          isCloseToExpiry(product.expiryDate) ? "text-red-600 font-medium" : ""
                        }>
                          {new Date(product.expiryDate).toLocaleDateString('pt-BR')}
                          {isCloseToExpiry(product.expiryDate) && (
                            <div className="text-xs">
                              {daysUntilExpiry(product.expiryDate)} dias
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
