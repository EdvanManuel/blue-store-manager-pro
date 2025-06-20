
import { Input } from "@/components/ui/input";

interface InvoiceDetailsProps {
  invoiceData: {
    requisitionNumber: string;
    currency: string;
    invoiceDate: string;
    dueDate: string;
    invoiceNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const InvoiceDetails = ({ invoiceData, onInputChange }: InvoiceDetailsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Input
        placeholder="Nº Requisição"
        value={invoiceData.requisitionNumber}
        onChange={(e) => onInputChange('requisitionNumber', e.target.value)}
      />
      <Input
        value={invoiceData.currency}
        onChange={(e) => onInputChange('currency', e.target.value)}
      />
      <Input
        type="date"
        value={invoiceData.invoiceDate}
        onChange={(e) => onInputChange('invoiceDate', e.target.value)}
      />
      <Input
        type="date"
        value={invoiceData.dueDate}
        onChange={(e) => onInputChange('dueDate', e.target.value)}
      />
      <Input
        placeholder="Factura nº"
        value={invoiceData.invoiceNumber}
        onChange={(e) => onInputChange('invoiceNumber', e.target.value)}
      />
    </div>
  );
};

export default InvoiceDetails;
