
import { useState, useCallback } from 'react';

export type DocumentType = 'factura' | 'recibo' | 'credito' | 'debito' | 'proforma' | 'devolucao';

export interface InvoiceItem {
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  documentType: DocumentType;
  storeName: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerTaxNumber?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  finalTotal: number;
  createdAt: string;
}

const STORAGE_KEY = 'automatic_invoices';

export const useAutomaticInvoicing = () => {
  const [invoices, setInvoices] = useState<InvoiceData[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const saveToStorage = useCallback((invoiceList: InvoiceData[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoiceList));
  }, []);

  const getDocumentPrefix = (documentType: DocumentType): string => {
    const prefixes = {
      factura: 'FT',
      recibo: 'RC',
      credito: 'NC',
      debito: 'ND',
      proforma: 'PF',
      devolucao: 'NR'
    };
    return prefixes[documentType];
  };

  const generateDocumentNumber = useCallback((documentType: DocumentType): string => {
    const prefix = getDocumentPrefix(documentType);
    const year = new Date().getFullYear();
    const existingDocs = invoices.filter(inv => 
      inv.documentType === documentType && 
      inv.invoiceNumber.startsWith(`${prefix}${year}`)
    );
    const nextNumber = existingDocs.length + 1;
    return `${prefix}${year}/${nextNumber.toString().padStart(4, '0')}`;
  }, [invoices]);

  const generateInvoice = useCallback((data: {
    documentType: DocumentType;
    storeName: string;
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    customerTaxNumber?: string;
    items: InvoiceItem[];
    subtotal: number;
    tax: number;
    finalTotal: number;
  }) => {
    const invoiceNumber = generateDocumentNumber(data.documentType);
    
    const newInvoice: InvoiceData = {
      ...data,
      invoiceNumber,
      createdAt: new Date().toISOString()
    };

    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    saveToStorage(updatedInvoices);

    return newInvoice;
  }, [invoices, generateDocumentNumber, saveToStorage]);

  const printInvoice = useCallback((invoice: InvoiceData) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const documentConfig = {
      factura: { title: 'FATURA', color: 'text-blue-600' },
      recibo: { title: 'RECIBO', color: 'text-green-600' },
      credito: { title: 'NOTA DE CRÉDITO', color: 'text-orange-600' },
      debito: { title: 'NOTA DE DÉBITO', color: 'text-red-600' },
      proforma: { title: 'FATURA PRÓ-FORMA', color: 'text-purple-600' },
      devolucao: { title: 'NOTA DE DEVOLUÇÃO', color: 'text-gray-600' }
    };

    const config = documentConfig[invoice.documentType];

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${config.title} ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #333; }
          .invoice-number { font-size: 18px; color: #666; margin-top: 10px; }
          .section { margin-bottom: 20px; }
          .label { font-weight: bold; }
          .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .items-table th { background-color: #f5f5f5; }
          .totals { margin-top: 20px; text-align: right; }
          .total-line { margin: 5px 0; }
          .final-total { font-size: 18px; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${config.title}</div>
          <div class="invoice-number">${invoice.invoiceNumber}</div>
        </div>
        
        <div class="section">
          <div class="label">Loja:</div>
          <div>${invoice.storeName}</div>
        </div>
        
        <div class="section">
          <div class="label">Cliente:</div>
          <div>${invoice.customerName}</div>
          ${invoice.customerPhone ? `<div>Tel: ${invoice.customerPhone}</div>` : ''}
          ${invoice.customerAddress ? `<div>${invoice.customerAddress}</div>` : ''}
          ${invoice.customerTaxNumber ? `<div>NIF: ${invoice.customerTaxNumber}</div>` : ''}
        </div>
        
        <table class="items-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Preço Unit.</th>
              <th>Desc. %</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.productCode}</td>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>${item.unitPrice.toFixed(2)} Kz</td>
                <td>${item.discount}%</td>
                <td>${item.total.toFixed(2)} Kz</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="totals">
          <div class="total-line">Subtotal: ${invoice.subtotal.toFixed(2)} Kz</div>
          <div class="total-line">IVA (14%): ${invoice.tax.toFixed(2)} Kz</div>
          <div class="total-line final-total">Total: ${invoice.finalTotal.toFixed(2)} Kz</div>
        </div>
        
        <div style="margin-top: 40px; font-size: 12px; color: #666;">
          Emitido em: ${new Date(invoice.createdAt).toLocaleString('pt-BR')}
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
    printInvoice,
    generateDocumentNumber
  };
};
