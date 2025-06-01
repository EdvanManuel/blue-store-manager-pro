
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight, Download, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getAllStores, getAllProducts, addStore, removeStore, initializeStoreData, Store } from "@/data/storeData";
import { exportStoresCSV, exportProductsCSV, exportInventoryReport } from "@/utils/exportUtils";
import AddStoreForm from "@/components/AddStoreForm";

const Dashboard = () => {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [showAddStore, setShowAddStore] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    initializeStoreData();
    const stores = getAllStores();
    setStoreList(stores);
  };

  const handleCallStore = (phone: string, storeName: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Ligando para ${storeName}...`, {
      description: phone,
    });
  };

  const handleAddStore = (newStore: Store) => {
    addStore(newStore);
    loadData();
    setShowAddStore(false);
    toast.success("Loja adicionada com sucesso!", {
      description: `${newStore.name} foi adicionada ao sistema.`
    });
  };

  const handleRemoveStore = (storeId: number, storeName: string) => {
    removeStore(storeId);
    loadData();
    toast.success("Loja removida com sucesso!", {
      description: `${storeName} foi removida do sistema.`
    });
  };

  const handleExportStores = () => {
    const stores = getAllStores();
    exportStoresCSV(stores);
    toast.success("Dados das lojas exportados!", {
      description: "Arquivo CSV baixado com sucesso."
    });
  };

  const handleExportProducts = () => {
    const products = getAllProducts();
    exportProductsCSV(products);
    toast.success("Dados dos produtos exportados!", {
      description: "Arquivo CSV baixado com sucesso."
    });
  };

  const handleExportFullReport = () => {
    const stores = getAllStores();
    const products = getAllProducts();
    exportInventoryReport(stores, products);
    toast.success("Relatório completo exportado!", {
      description: "Relatório detalhado baixado com sucesso."
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-center md:text-left text-blue-dark">
          Visão Geral das Lojas
        </h1>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportStores}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Lojas
          </Button>
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Produtos
          </Button>
          <Button onClick={handleExportFullReport}>
            <Download className="h-4 w-4 mr-2" />
            Relatório Completo
          </Button>
        </div>
      </div>

      {showAddStore && (
        <AddStoreForm
          onStoreAdded={handleAddStore}
          onCancel={() => setShowAddStore(false)}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeList.map((store) => (
          <Card key={store.id} className="card-hover border border-blue-light/30 overflow-hidden">
            <CardHeader className="blue-gradient-bg text-white">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{store.name}</CardTitle>
                  <CardDescription className="text-white/80">
                    {store.address}
                  </CardDescription>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a loja "{store.name}"? 
                        Todos os produtos desta loja também serão removidos. 
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleRemoveStore(store.id, store.name)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Faturamento Mensal:</span>
                  <span className="font-semibold">{store.monthlySales.toLocaleString('pt-BR')} Kz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Produtos com Estoque Crítico:</span>
                  <span className={`font-semibold ${store.criticalStock > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                    {store.criticalStock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Produtos a Expirar:</span>
                  <span className={`font-semibold ${store.expiringProducts > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                    {store.expiringProducts}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                className="text-blue-light hover:text-blue-dark hover:bg-blue-light/10"
                onClick={() => handleCallStore(store.phone, store.name)}
              >
                <Phone className="h-4 w-4 mr-2" /> Ligar
              </Button>
              <Button asChild>
                <Link to={`/store/${store.id}`}>
                  Acessar Loja <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Add New Store Card */}
        {!showAddStore && (
          <Card className="border border-dashed border-blue-light/50 flex flex-col items-center justify-center p-6 card-hover bg-blue-light/5 min-h-[300px]">
            <div className="text-5xl text-blue-light mb-4">+</div>
            <h3 className="text-lg font-medium text-blue-dark mb-2">Adicionar Nova Loja</h3>
            <p className="text-gray-500 text-center mb-4">Clique para adicionar uma nova loja ao sistema</p>
            <Button 
              variant="outline" 
              className="border-blue-light text-blue-dark"
              onClick={() => setShowAddStore(true)}
            >
              Adicionar Loja
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
