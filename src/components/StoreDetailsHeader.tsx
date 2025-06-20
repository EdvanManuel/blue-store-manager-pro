
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreDetailsHeaderProps {
  storeName: string;
  onExportProducts: () => void;
}

const StoreDetailsHeader = ({ storeName, onExportProducts }: StoreDetailsHeaderProps) => {
  return (
    <div className="mb-8">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/" className="flex items-center text-blue-dark">
          <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Dashboard
        </Link>
      </Button>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-dark">{storeName}</h1>
        <Button variant="outline" onClick={onExportProducts}>
          <Download className="h-4 w-4 mr-2" />
          Exportar Produtos
        </Button>
      </div>
    </div>
  );
};

export default StoreDetailsHeader;
