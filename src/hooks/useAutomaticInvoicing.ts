
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

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${documentTitles[invoice.documentType]} ${invoice.invoiceNumber}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
        <style>
          @media print {
            @page {
              margin: 10mm;
              size: 80mm auto;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
          
          body { 
            font-family: 'JetBrains Mono', Monaco, Consolas, monospace; 
            font-size: 12px;
            line-height: 1.3;
            max-width: 300px;
            margin: 0 auto;
            padding: 8px;
            background: white;
          }
          
          .header { 
            text-align: center; 
            border-bottom: 2px solid black; 
            padding-bottom: 8px; 
            margin-bottom: 12px; 
          }
          
          .store-name { 
            font-size: 16px; 
            font-weight: bold; 
            text-transform: uppercase;
          }
          
          .subtitle { 
            font-size: 10px; 
            margin-top: 4px; 
          }
          
          .doc-info { 
            text-align: center; 
            margin-bottom: 12px; 
          }
          
          .doc-title { 
            font-size: 14px; 
            font-weight: bold; 
          }
          
          .doc-number { 
            font-size: 12px; 
          }
          
          .datetime { 
            display: flex; 
            justify-content: space-between; 
            font-size: 10px; 
            margin-bottom: 12px; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 8px; 
          }
          
          .customer { 
            font-size: 10px; 
            margin-bottom: 12px; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 8px; 
          }
          
          .items-header { 
            font-size: 10px; 
            font-weight: bold; 
            display: grid; 
            grid-template-columns: 2fr 1fr 1fr 1fr; 
            gap: 4px; 
            border-bottom: 1px solid #ccc; 
            padding-bottom: 4px; 
            margin-bottom: 8px; 
          }
          
          .item { 
            margin-bottom: 8px; 
            font-size: 10px; 
          }
          
          .item-name { 
            font-weight: 500; 
          }
          
          .item-code { 
            color: #666; 
            font-size: 9px; 
          }
          
          .item-details { 
            display: grid; 
            grid-template-columns: 2fr 1fr 1fr 1fr; 
            gap: 4px; 
            margin-top: 2px; 
          }
          
          .item-details > span:not(:first-child) { 
            text-align: right; 
          }
          
          .discount { 
            color: #d00; 
            font-size: 9px; 
            text-align: right; 
          }
          
          .separator { 
            border-top: 2px solid black; 
            margin: 8px 0; 
          }
          
          .totals { 
            font-size: 10px; 
          }
          
          .total-line { 
            display: flex; 
            justify-content: space-between; 
            margin: 4px 0; 
          }
          
          .final-total { 
            font-size: 14px; 
            font-weight: bold; 
            border-top: 1px solid #ccc; 
            padding-top: 4px; 
            margin-top: 4px; 
          }
          
          .footer { 
            border-top: 2px solid black; 
            margin-top: 12px; 
            padding-top: 8px; 
            text-align: center; 
            font-size: 10px; 
          }
          
          .footer-msg1 { 
            margin-bottom: 8px; 
          }
          
          .footer-msg2 { 
            font-weight: bold; 
            margin: 4px 0; 
          }
          
          .processed { 
            color: #666; 
            font-size: 9px; 
            margin-top: 4px; 
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="store-name">${invoice.storeName}</div>
          <div class="subtitle">SISTEMA DE GESTÃO</div>
        </div>
        
        <div class="doc-info">
          <div class="doc-title">${documentTitles[invoice.documentType]}</div>
          <div class="doc-number">${invoice.invoiceNumber}</div>
        </div>
        
        <div class="datetime">
          <span>Data: ${dateStr}</span>
          <span>Hora: ${timeStr}</span>
        </div>
        
        <div class="customer">
          <div><strong>Cliente:</strong> ${invoice.customerName}</div>
          ${invoice.customerPhone ? `<div><strong>Tel:</strong> ${invoice.customerPhone}</div>` : ''}
          ${invoice.customerTaxNumber ? `<div><strong>NIF:</strong> ${invoice.customerTaxNumber}</div>` : ''}
        </div>
        
        <div class="items-header">
          <span>ITEM</span>
          <span style="text-align: right;">QTD</span>
          <span style="text-align: right;">PREÇO</span>
          <span style="text-align: right;">TOTAL</span>
        </div>
        
        ${invoice.items.map(item => `
          <div class="item">
            <div class="item-name">${item.productName}</div>
            <div class="item-code">Cód: ${item.productCode}</div>
            <div class="item-details">
              <span></span>
              <span>${item.quantity}</span>
              <span>${item.unitPrice.toFixed(2)}</span>
              <span style="font-weight: 500;">${item.total.toFixed(2)}</span>
            </div>
            ${item.discount > 0 ? `<div class="discount">Desc. ${item.discount}%</div>` : ''}
          </div>
        `).join('')}
        
        <div class="separator"></div>
        
        <div class="totals">
          <div class="total-line">
            <span>SUBTOTAL:</span>
            <span>${invoice.subtotal.toFixed(2)} Kz</span>
          </div>
          <div class="total-line">
            <span>IVA (14%):</span>
            <span>${invoice.tax.toFixed(2)} Kz</span>
          </div>
          <div class="total-line final-total">
            <span>TOTAL:</span>
            <span>${invoice.finalTotal.toFixed(2)} Kz</span>
          </div>
        </div>
        
        <div class="footer">
          <div class="footer-msg1">Obrigado pela sua preferência!</div>
          <div class="footer-msg2">*** ${documentTitles[invoice.documentType]} ***</div>
          <div class="processed">Processado por computador</div>
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
