
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Product
} from "@/data/storeData";
import { exportProductsCSV } from "@/utils/exportUtils";
import StoreDetailsHeader from "@/components/StoreDetailsHeader";
import StoreInfoCard from "@/components/StoreInfoCard";
import StoreStatisticsCard from "@/components/StoreStatisticsCard";
import ProductsManagement from "@/components/ProductsManagement";
import { Link } from "react-router-dom";

const StoreDetails = () => {
  const { id } = useParams();
  const storeId = Number(id);
  const [store, setStore] = useState<Store | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Load store data
  useEffect(() => {
    initializeStoreData();
    loadStoreData();
  }, [storeId]);

  const loadStoreData = () => {
    const currentStore = getStoreById(storeId);
    setStore(currentStore);
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

  const handleStoreUpdate = (updatedStore: Store) => {
    updateStore(updatedStore);
    setStore(updatedStore);
    
    toast.success("Informações da loja atualizadas com sucesso!", {
      description: `As alterações em ${updatedStore.name} foram salvas permanentemente.`
    });
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
    toast.success("Produto adicionado com sucesso!", {
      description: `${newProduct.name} foi adicionado ao estoque.`
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct);
    loadStoreData();
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

  return (
    <div className="container mx-auto">
      <StoreDetailsHeader 
        storeName={store.name}
        onExportProducts={handleExportProducts}
      />

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        {/* Store Info Tab */}
        <TabsContent value="info">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StoreInfoCard
              store={store}
              onStoreUpdate={handleStoreUpdate}
              onCallStore={handleCallStore}
            />
            <StoreStatisticsCard store={store} />
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <ProductsManagement
            storeId={storeId}
            products={products}
            onProductAdded={handleAddProduct}
            onProductUpdated={handleUpdateProduct}
            onProductRemoved={handleRemoveProduct}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreDetails;
