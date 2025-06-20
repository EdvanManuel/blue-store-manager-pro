
import { Receipt, Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvoiceHeaderProps {
  onPrint: () => void;
  onSave: () => void;
}

const InvoiceHeader = ({ onPrint, onSave }: InvoiceHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Receipt className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-dark">
          Editor de Factura
        </h1>
      </div>
      <div className="flex gap-2">
        <Button onClick={onPrint} variant="outline">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir
        </Button>
        <Button onClick={onSave}>
          <Download className="h-4 w-4 mr-2" />
          Guardar
        </Button>
      </div>
    </div>
  );
};

export default InvoiceHeader;
