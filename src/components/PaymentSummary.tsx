
interface PaymentSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

const PaymentSummary = ({ subtotal, tax, total }: PaymentSummaryProps) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Resumo de Pagamento</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} Kz</span>
          </div>
          <div className="flex justify-between">
            <span>IVA (14%):</span>
            <span>{tax.toFixed(2)} Kz</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Total:</span>
            <span>{total.toFixed(2)} Kz</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
