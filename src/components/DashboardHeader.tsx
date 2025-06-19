
import { Brain, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllStores, getAllProducts } from "@/data/storeData";
import { exportStoresCSV, exportProductsCSV, exportInventoryReport } from "@/utils/exportUtils";
import { toast } from "sonner";

const DashboardHeader = () => {
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
  );
};

export default DashboardHeader;
