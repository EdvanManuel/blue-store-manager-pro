
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Edit, Phone, ArrowLeft, Save, Trash2, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { 
  getStoreById, 
  getProductsByStoreId, 
  updateStore,
  initializeStoreData,
  addProduct,
  removeProduct,
  updateProduct,
  Store, 
  Product,
  hasLowStock,
  isCloseToExpiry,
  daysUntilExpiry
} from "@/data/storeData";
import { exportProductsCSV } from "@/utils/exportUtils";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";

const StoreDetails = () => {
  const { id } = useParams();
  const storeId = Number(id);
  const [store, setStore] = useState<Store | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Store | undefined>(undefined);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Load store data
  useEffect(() => {
    initializeStoreData();
    loadStoreData();
  }, [storeId]);

  const loadStoreData = () => {
    const currentStore = getStoreById(storeId);
    setStore(currentStore);
    
    if (currentStore) {
      setEditFormData({...currentStore});
    }
    
    loadProducts();
  };

  const loadProducts = () => {
    const storeProducts = getProductsByStoreId(storeId);
    setProducts(storeProducts);
  };

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Loja não encontrada</h2>
        <Button asChild>
          <Link to="/">Voltar para o Dashboard</Link>
        </Button>
      </div>
    );
  }

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => prev ? ({ ...prev, [name]: value }) : undefined);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editFormData) {
      updateStore(editFormData);
      setStore(editFormData);
      setIsEditing(false);
      
      toast.success("Informações da loja atualizadas com sucesso!", {
        description: `As alterações em ${editFormData.name} foram salvas permanentemente.`
      });
    }
  };

  const handleCallStore = () => {
    window.location.href = `tel:${store.phone}`;
    toast.success(`Ligando para ${store.name}...`, {
      description: store.phone
    });
  };

  const handleAddProduct = (newProduct: Product) => {
    addProduct(newProduct);
    loadStoreData();
    setShowAddProduct(false);
    toast.success("Produto adicionado com sucesso!", {
      description: `${newProduct.name} foi adicionado ao estoque.`
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct);
    loadStoreData();
    setEditingProduct(null);
    toast.success("Produto atualizado com sucesso!", {
      description: `${updatedProduct.name} foi atualizado.`
    });
  };

  const handleRemoveProduct = (productId: number, productName: string) => {
    removeProduct(productId);
    loadProducts();
    toast.success("Produto removido com sucesso!", {
      description: `${productName} foi removido do estoque.`
    });
  };

  const handleExportProducts = () => {
    exportProductsCSV(products);
    toast.success("Produtos exportados!", {
      description: "Arquivo CSV baixado com sucesso."
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center text-blue-dark">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Dashboard
          </Link>
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-dark">{store.name}</h1>
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Produtos
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        {/* Store Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Detalhes da Loja</CardTitle>
                  {!isEditing ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome da Loja</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={editFormData?.name || ''} 
                        onChange={handleEditFormChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        value={editFormData?.address || ''} 
                        onChange={handleEditFormChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={editFormData?.phone || ''} 
                        onChange={handleEditFormChange} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={editFormData?.email || ''} 
                        onChange={handleEditFormChange} 
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setEditFormData({...store});
                        setIsEditing(false);
                      }}>
                        Cancelar
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-1" /> Salvar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-2">
                      <Label className="text-gray-500">Nome da Loja</Label>
                      <div className="font-semibold">{store.name}</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label className="text-gray-500">Endereço</Label>
                      <div className="font-semibold">{store.address}</div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label className="text-gray-500">Telefone</Label>
                      <div className="font-semibold flex items-center">
                        {store.phone}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 text-blue-light" 
                          onClick={handleCallStore}
                        >
                          <Phone className="h-4 w-4" />
                          <span className="ml-1">Ligar</span>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label className="text-gray-500">E-mail</Label>
                      <div className="font-semibold">
                        <a href={`mailto:${store.email}`} className="text-blue-light hover:underline">
                          {store.email}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-blue-light/10 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Faturamento Mensal</h3>
                    <p className="text-2xl font-bold text-blue-dark">{store.monthlySales.toLocaleString('pt-BR')} Kz</p>
                  </div>
                  
                  <div className={`${store.criticalStock > 5 ? 'bg-red-100' : 'bg-amber-50'} p-4 rounded-lg`}>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Produtos com Estoque Crítico</h3>
                    <p className={`text-2xl font-bold ${store.criticalStock > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                      {store.criticalStock}
                    </p>
                  </div>
                  
                  <div className={`${store.expiringProducts > 5 ? 'bg-red-100' : 'bg-amber-50'} p-4 rounded-lg`}>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Produtos a Expirar</h3>
                    <p className={`text-2xl font-bold ${store.expiringProducts > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                      {store.expiringProducts}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          {showAddProduct && (
            <AddProductForm
              storeId={storeId}
              onProductAdded={handleAddProduct}
              onCancel={() => setShowAddProduct(false)}
            />
          )}

          {editingProduct && (
            <EditProductForm
              product={editingProduct}
              onProductUpdated={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
            />
          )}
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Produtos da Loja ({products.length})</CardTitle>
                {!showAddProduct && !editingProduct && (
                  <Button onClick={() => setShowAddProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-dark text-white">
                      <th className="px-4 py-3 text-left">Nome</th>
                      <th className="px-4 py-3 text-left">Código</th>
                      <th className="px-4 py-3 text-left">Categoria</th>
                      <th className="px-4 py-3 text-right">Preço de Custo</th>
                      <th className="px-4 py-3 text-right">Preço de Venda</th>
                      <th className="px-4 py-3 text-center">Estoque</th>
                      <th className="px-4 py-3 text-center">Validade</th>
                      <th className="px-4 py-3 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                          Nenhum produto encontrado. Clique em "Adicionar Produto" para começar.
                        </td>
                      </tr>
                    ) : (
                      products.map((product) => (
                        <tr 
                          key={product.id} 
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="px-4 py-3">{product.name}</td>
                          <td className="px-4 py-3">{product.code}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3 text-right">{product.costPrice.toLocaleString('pt-BR')} Kz</td>
                          <td className="px-4 py-3 text-right">{product.sellingPrice.toLocaleString('pt-BR')} Kz</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              hasLowStock(product.quantity) 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {product.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              isCloseToExpiry(product.expiryDate) 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {formatDate(product.expiryDate)}
                              {isCloseToExpiry(product.expiryDate) && (
                                <span className="block text-xs mt-1">
                                  Expira em {daysUntilExpiry(product.expiryDate)} dias
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => setEditingProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost" className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Excluir</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o produto "{product.name}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleRemoveProduct(product.id, product.name)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreDetails;
