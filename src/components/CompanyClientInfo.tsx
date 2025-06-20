
import { Input } from "@/components/ui/input";

interface CompanyClientInfoProps {
  invoiceData: {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyTaxNumber: string;
    clientName: string;
    clientAddress: string;
    clientPhone: string;
    clientTaxNumber: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const CompanyClientInfo = ({ invoiceData, onInputChange }: CompanyClientInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Informações da Empresa</h3>
        <Input
          placeholder="Nome da Empresa"
          value={invoiceData.companyName}
          onChange={(e) => onInputChange('companyName', e.target.value)}
        />
        <Input
          placeholder="Morada"
          value={invoiceData.companyAddress}
          onChange={(e) => onInputChange('companyAddress', e.target.value)}
        />
        <Input
          placeholder="Telefone"
          value={invoiceData.companyPhone}
          onChange={(e) => onInputChange('companyPhone', e.target.value)}
        />
        <Input
          placeholder="Nº de Contribuinte"
          value={invoiceData.companyTaxNumber}
          onChange={(e) => onInputChange('companyTaxNumber', e.target.value)}
        />
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Informações do Cliente</h3>
        <Input
          placeholder="Nome do Cliente"
          value={invoiceData.clientName}
          onChange={(e) => onInputChange('clientName', e.target.value)}
        />
        <Input
          placeholder="Morada"
          value={invoiceData.clientAddress}
          onChange={(e) => onInputChange('clientAddress', e.target.value)}
        />
        <Input
          placeholder="Telefone"
          value={invoiceData.clientPhone}
          onChange={(e) => onInputChange('clientPhone', e.target.value)}
        />
        <Input
          placeholder="Nº de Contribuinte"
          value={invoiceData.clientTaxNumber}
          onChange={(e) => onInputChange('clientTaxNumber', e.target.value)}
        />
      </div>
    </div>
  );
};

export default CompanyClientInfo;
