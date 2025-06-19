
import { useState } from "react";
import { 
  Search,
  BarChart3,
  Zap,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store } from "@/data/storeData";
import IntelligentDashboard from "./IntelligentDashboard";
import SmartAlerts from "./SmartAlerts";
import AdvancedSearch from "./AdvancedSearch";
import AddStoreForm from "./AddStoreForm";
import StoreGrid from "./StoreGrid";

interface DashboardTabsProps {
  storeList: Store[];
  onAddStore: (newStore: Store) => void;
  onRemoveStore: (storeId: number, storeName: string) => void;
}

const DashboardTabs = ({ storeList, onAddStore, onRemoveStore }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddStore, setShowAddStore] = useState(false);

  const handleAddStore = (newStore: Store) => {
    onAddStore(newStore);
    setShowAddStore(false);
  };

  return (
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

      <TabsContent value="overview" className="space-y-6">
        <IntelligentDashboard />
      </TabsContent>

      <TabsContent value="alerts" className="space-y-6">
        <SmartAlerts />
      </TabsContent>

      <TabsContent value="search" className="space-y-6">
        <AdvancedSearch />
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
