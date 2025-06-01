
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Phone, 
  ArrowRight, 
  Download, 
  Trash2,
  Search,
  Brain,
  BarChart3,
  Zap
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getAllStores, getAllProducts, addStore, removeStore, initializeStoreData, Store } from "@/data/storeData";
import { exportStoresCSV, exportProductsCSV, exportInventoryReport } from "@/utils/exportUtils";
import AddStoreForm from "@/components/AddStoreForm";
import IntelligentDashboard from "@/components/IntelligentDashboard";
import SmartAlerts from "@/components/SmartAlerts";
import AdvancedSearch from "@/components/AdvancedSearch";

const Dashboard = () => {
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [showAddStore, setShowAddStore] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

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
    <div className="container mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-dark flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Sistema Inteligente de Gestão
          </h1>
          <p className="text-muted-foreground mt-1">
            Dashboard avançado com IA para otimização total do seu negócio
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportStores} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Lojas
          </Button>
          <Button variant="outline" onClick={handleExportProducts} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Produtos
          </Button>
          <Button onClick={handleExportFullReport} size="sm">
            <Download className="h-4 w-4 mr-2" />
            Relatório IA
          </Button>
        </div>
      </div>

      {/* Intelligent Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard IA
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Alertas Inteligentes
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Busca Avançada
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Gestão de Lojas
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <IntelligentDashboard />
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <SmartAlerts />
        </TabsContent>

        {/* Search Tab */}
        <TabsContent value="search" className="space-y-6">
          <AdvancedSearch />
        </TabsContent>

        {/* Stores Management Tab */}
        <TabsContent value="stores" className="space-y-6">
          {showAddStore && (
            <AddStoreForm
              onStoreAdded={handleAddStore}
              onCancel={() => setShowAddStore(false)}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {storeList.map((store) => (
              <Card key={store.id} className="card-hover border border-blue-light/30 overflow-hidden group">
                <CardHeader className="blue-gradient-bg text-white relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{store.name}</CardTitle>
                      <CardDescription className="text-white/80">
                        {store.address}
                      </CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
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
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Faturamento Mensal:</span>
                      <span className="font-semibold text-green-600">
                        {store.monthlySales.toLocaleString('pt-BR')} Kz
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estoque Crítico:</span>
                      <span className={`font-semibold ${store.criticalStock > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                        {store.criticalStock} {store.criticalStock === 1 ? 'item' : 'itens'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Produtos a Expirar:</span>
                      <span className={`font-semibold ${store.expiringProducts > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                        {store.expiringProducts} {store.expiringProducts === 1 ? 'produto' : 'produtos'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 bg-gradient-to-r from-gray-50 to-blue-50">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() => handleCallStore(store.phone, store.name)}
                  >
                    <Phone className="h-4 w-4 mr-2" /> Ligar
                  </Button>
                  <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link to={`/store/${store.id}`}>
                      Acessar <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add New Store Card */}
            {!showAddStore && (
              <Card className="border border-dashed border-blue-400/50 flex flex-col items-center justify-center p-6 card-hover bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[320px] group">
                <div className="text-6xl text-blue-400 mb-4 group-hover:scale-110 transition-transform">+</div>
                <h3 className="text-lg font-medium text-blue-700 mb-2">Adicionar Nova Loja</h3>
                <p className="text-blue-600/70 text-center mb-4 text-sm">
                  Expanda sua rede e maximize seus lucros
                </p>
                <Button 
                  variant="outline" 
                  className="border-blue-400 text-blue-700 hover:bg-blue-100"
                  onClick={() => setShowAddStore(true)}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Adicionar Loja
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
