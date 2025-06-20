
import { Input } from "@/components/ui/input";

interface PaymentSummaryProps {
  invoiceData: {
    paymentMethod: string;
    bankDetails: string;
    currency: string;
  };
  onInputChange: (field: string, value: string) => void;
  calculateTotal: () => number;
}

const PaymentSummary = ({ invoiceData, onInputChange, calculateTotal }: PaymentSummaryProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <h3 className="font-semibold">Forma de Pagamento</h3>
        <Input
          value={invoiceData.paymentMethod}
          onChange={(e) => onInputChange('paymentMethod', e.target.value)}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Coordenadas Bancárias</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded text-sm"
            rows={3}
            value={invoiceData.bankDetails}
            onChange={(e) => onInputChange('bankDetails', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Mercadoria/Serviço:</span>
          <span>{calculateTotal().toFixed(2)} {invoiceData.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Descontos Comerciais:</span>
          <span>0.00 {invoiceData.currency}</span>
        </div>
        <div className="flex justify-between">
          <span>Descontos Financeiros:</span>
          <span>0.00 {invoiceData.currency}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span>IPC:</span>
          <span>0.00 {invoiceData.currency}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total ({invoiceData.currency}):</span>
          <span>{calculateTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
