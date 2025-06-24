
import { useState } from "react";
import { 
  Search,
  BarChart3,
  Zap,
  ArrowRight,
  Shield,
  DollarSign,
  Tag,
  Bell,
  Users
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store } from "@/data/storeData";
import IntelligentDashboard from "./IntelligentDashboard";
import SmartAlerts from "./SmartAlerts";
import AdvancedSearch from "./AdvancedSearch";
import AdvancedSystemPanel from "./AdvancedSystemPanel";
import AddStoreForm from "./AddStoreForm";
import StoreGrid from "./StoreGrid";
import FinancialDashboard from "./FinancialDashboard";
import CategoryManagement, { Category } from "./CategoryManagement";
import NotificationCenter from "./NotificationCenter";
import Customers from "../pages/Customers";

interface DashboardTabsProps {
  storeList: Store[];
  onAddStore: (newStore: Store) => void;
  onRemoveStore: (storeId: number, storeName: string) => void;
}

const DashboardTabs = ({ storeList, onAddStore, onRemoveStore }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddStore, setShowAddStore] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    { id: 1, name: 'Alimentos', description: 'Produtos alimentícios', color: '#10B981', icon: '🍔', productCount: 8 },
    { id: 2, name: 'Bebidas', description: 'Bebidas diversas', color: '#3B82F6', icon: '🥤', productCount: 3 },
    { id: 3, name: 'Limpeza', description: 'Produtos de limpeza', color: '#8B5CF6', icon: '🧽', productCount: 2 },
    { id: 4, name: 'Higiene', description: 'Produtos de higiene pessoal', color: '#F59E0B', icon: '🧼', productCount: 1 },
    { id: 5, name: 'Laticínios', description: 'Leite e derivados', color: '#EF4444', icon: '🥛', productCount: 2 }
  ]);

  const handleAddStore = (newStore: Store) => {
    onAddStore(newStore);
    setShowAddStore(false);
  };

  const handleCategoryAdded = (newCategory: Category) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories(prev => prev.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    ));
  };

  const handleCategoryRemoved = (categoryId: number) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-9">
        <TabsTrigger value="overview" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Dashboard IA
        </TabsTrigger>
        <TabsTrigger value="financial" className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Financeiro
        </TabsTrigger>
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          Notificações
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Categorias
        </TabsTrigger>
        <TabsTrigger value="customers" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Clientes
        </TabsTrigger>
        <TabsTrigger value="alerts" className="flex items-center gap-2">
          <Zap className="h-4 w-4" />
          Alertas
        </TabsTrigger>
        <TabsTrigger value="search" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Busca
        </TabsTrigger>
        <TabsTrigger value="system" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Sistema
        </TabsTrigger>
        <TabsTrigger value="stores" className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4" />
          Lojas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <IntelligentDashboard />
      </TabsContent>

      <TabsContent value="financial" className="space-y-6">
        <FinancialDashboard />
      </TabsContent>

      <TabsContent value="notifications" className="space-y-6">
        <NotificationCenter />
      </TabsContent>

      <TabsContent value="categories" className="space-y-6">
        <CategoryManagement
          categories={categories}
          onCategoryAdded={handleCategoryAdded}
          onCategoryUpdated={handleCategoryUpdated}
          onCategoryRemoved={handleCategoryRemoved}
        />
      </TabsContent>

      <TabsContent value="customers" className="space-y-6">
        <Customers />
      </TabsContent>

      <TabsContent value="alerts" className="space-y-6">
        <SmartAlerts />
      </TabsContent>

      <TabsContent value="search" className="space-y-6">
        <AdvancedSearch />
      </TabsContent>

      <TabsContent value="system" className="space-y-6">
        <AdvancedSystemPanel />
      </TabsContent>

      <TabsContent value="stores" className="space-y-6">
        {showAddStore && (
          <AddStoreForm
            onStoreAdded={handleAddStore}
            onCancel={() => setShowAddStore(false)}
          />
        )}
        
        <StoreGrid
          stores={storeList}
          showAddStore={showAddStore}
          onAddStoreClick={() => setShowAddStore(true)}
          onRemoveStore={onRemoveStore}
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
