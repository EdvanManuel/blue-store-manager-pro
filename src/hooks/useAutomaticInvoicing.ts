
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface InvoiceProduct {
  code: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discount: string;
  tax: string;
  total: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  currency: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyTaxNumber: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientTaxNumber: string;
  products: InvoiceProduct[];
  subtotal: number;
  tax: number;
  total: number;
}

export const useAutomaticInvoicing = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);

  const generateInvoice = useCallback((saleData: {
    storeName: string;
    customerName?: string;
    customerPhone?: string;
    items: Array<{
      productCode: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      discount: number;
      total: number;
    }>;
    subtotal: number;
    tax: number;
    finalTotal: number;
  }) => {
    const invoiceNumber = `INV-${Date.now()}`;
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    const invoice: InvoiceData = {
      invoiceNumber,
      invoiceDate: currentDate.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      currency: 'AOA',
      companyName: saleData.storeName,
      companyAddress: '',
      companyPhone: '',
      companyTaxNumber: '',
      clientName: saleData.customerName || 'Cliente',
      clientAddress: '',
      clientPhone: saleData.customerPhone || '',
      clientTaxNumber: '',
      products: saleData.items.map(item => ({
        code: item.productCode,
        description: item.productName,
        quantity: item.quantity.toString(),
        unit: 'Un',
        unitPrice: item.unitPrice.toString(),
        discount: item.discount.toString(),
        tax: '14',
        total: item.total.toString()
      })),
      subtotal: saleData.subtotal,
      tax: saleData.tax,
      total: saleData.finalTotal
    };

    setInvoices(prev => [invoice, ...prev]);
    
    // Salvar fatura automaticamente
    const invoiceBlob = new Blob([JSON.stringify(invoice)], { type: 'application/json' });
    const url = URL.createObjectURL(invoiceBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fatura-${invoice.invoiceNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(`Fatura ${invoiceNumber} gerada automaticamente!`, {
      description: 'A fatura foi salva automaticamente'
    });

    return invoice;
  }, []);

  const printInvoice = useCallback((invoiceData: InvoiceData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Fatura ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .company-info, .client-info { display: inline-block; width: 45%; vertical-align: top; }
            .invoice-details { text-align: center; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .totals { text-align: right; margin-top: 20px; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FATURA</h1>
            <h2>Nº ${invoiceData.invoiceNumber}</h2>
          </div>
          
          <div class="company-info">
            <h3>Empresa</h3>
            <p><strong>${invoiceData.companyName}</strong></p>
            <p>${invoiceData.companyAddress}</p>
            <p>Tel: ${invoiceData.companyPhone}</p>
            <p>NIF: ${invoiceData.companyTaxNumber}</p>
          </div>
          
          <div class="client-info">
            <h3>Cliente</h3>
            <p><strong>${invoiceData.clientName}</strong></p>
            <p>${invoiceData.clientAddress}</p>
            <p>Tel: ${invoiceData.clientPhone}</p>
            <p>NIF: ${invoiceData.clientTaxNumber}</p>
          </div>
          
          <div class="invoice-details">
            <p>Data: ${new Date(invoiceData.invoiceDate).toLocaleDateString('pt-BR')}</p>
            <p>Vencimento: ${new Date(invoiceData.dueDate).toLocaleDateString('pt-BR')}</p>
            <p>Moeda: ${invoiceData.currency}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Descrição</th>
                <th>Qtd</th>
                <th>Un</th>
                <th>Preço Unit.</th>
                <th>Desc. %</th>
                <th>IVA %</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.products.map(product => `
                <tr>
                  <td>${product.code}</td>
                  <td>${product.description}</td>
                  <td>${product.quantity}</td>
                  <td>${product.unit}</td>
                  <td>${parseFloat(product.unitPrice).toFixed(2)} Kz</td>
                  <td>${product.discount}%</td>
                  <td>${product.tax}%</td>
                  <td>${parseFloat(product.total).toFixed(2)} Kz</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <p>Subtotal: ${invoiceData.subtotal.toFixed(2)} Kz</p>
            <p>IVA (14%): ${invoiceData.tax.toFixed(2)} Kz</p>
            <p><strong>Total: ${invoiceData.total.toFixed(2)} Kz</strong></p>
          </div>
          
          <div class="footer">
            <p>Todos os bens foram colocados à disposição do adquirente na data da factura</p>
            <p><strong>Processado por computador</strong></p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }, []);

  return {
    invoices,
    generateInvoice,
    printInvoice
  };
};
