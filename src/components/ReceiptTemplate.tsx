
import { InvoiceData } from "@/hooks/useAutomaticInvoicing";

interface ReceiptTemplateProps {
  invoice: InvoiceData;
}

const ReceiptTemplate = ({ invoice }: ReceiptTemplateProps) => {
  const documentTitles = {
    factura: 'FATURA',
    recibo: 'RECIBO',
    credito: 'NOTA DE CRÉDITO',
    debito: 'NOTA DE DÉBITO',
    proforma: 'FATURA PRÓ-FORMA',
    devolucao: 'NOTA DE DEVOLUÇÃO'
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString('pt-BR');
    const timeStr = date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(invoice.createdAt);

  return (
    <div className="font-mono text-sm bg-white p-4 max-w-sm mx-auto border">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <div className="text-lg font-bold">{invoice.storeName.toUpperCase()}</div>
        <div className="text-xs mt-1">SISTEMA DE GESTÃO</div>
      </div>

      {/* Document Type and Number */}
      <div className="text-center mb-3">
        <div className="text-base font-bold">{documentTitles[invoice.documentType]}</div>
        <div className="text-sm">{invoice.invoiceNumber}</div>
      </div>

      {/* Date and Time */}
      <div className="flex justify-between text-xs mb-3 border-b border-gray-300 pb-2">
        <span>Data: {dateStr}</span>
        <span>Hora: {timeStr}</span>
      </div>

      {/* Customer Info */}
      <div className="text-xs mb-3 border-b border-gray-300 pb-2">
        <div><strong>Cliente:</strong> {invoice.customerName}</div>
        {invoice.customerPhone && (
          <div><strong>Tel:</strong> {invoice.customerPhone}</div>
        )}
        {invoice.customerTaxNumber && (
          <div><strong>NIF:</strong> {invoice.customerTaxNumber}</div>
        )}
      </div>

      {/* Items */}
      <div className="mb-3">
        <div className="text-xs border-b border-gray-300 pb-1 mb-2">
          <div className="grid grid-cols-4 gap-1 font-bold">
            <span>ITEM</span>
            <span className="text-right">QTD</span>
            <span className="text-right">PREÇO</span>
            <span className="text-right">TOTAL</span>
          </div>
        </div>
        
        {invoice.items.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="text-xs">
              <div className="truncate">{item.productName}</div>
              <div className="text-xs text-gray-600">Cód: {item.productCode}</div>
            </div>
            <div className="grid grid-cols-4 gap-1 text-xs">
              <span></span>
              <span className="text-right">{item.quantity}</span>
              <span className="text-right">{item.unitPrice.toFixed(2)}</span>
              <span className="text-right font-medium">{item.total.toFixed(2)}</span>
            </div>
            {item.discount > 0 && (
              <div className="text-xs text-red-600 text-right">
                Desc. {item.discount}%
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Separator */}
      <div className="border-t-2 border-black my-2"></div>

      {/* Totals */}
      <div className="text-xs space-y-1">
        <div className="flex justify-between">
          <span>SUBTOTAL:</span>
          <span>{invoice.subtotal.toFixed(2)} Kz</span>
        </div>
        
        <div className="flex justify-between">
          <span>IVA (14%):</span>
          <span>{invoice.tax.toFixed(2)} Kz</span>
        </div>
        
        <div className="border-t border-gray-300 pt-1">
          <div className="flex justify-between font-bold text-base">
            <span>TOTAL:</span>
            <span>{invoice.finalTotal.toFixed(2)} Kz</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-black mt-3 pt-2 text-center">
        <div className="text-xs">
          <div>Obrigado pela sua preferência!</div>
          <div className="mt-2">*** {documentTitles[invoice.documentType]} ***</div>
          <div className="text-xs text-gray-600 mt-1">
            Processado por computador
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptTemplate;
