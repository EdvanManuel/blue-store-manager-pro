
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Printer, Download } from "lucide-react";

type DocumentType = 'factura' | 'recibo' | 'credito' | 'debito' | 'proforma' | 'devolucao';

interface ProductRow {
  id: string;
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: string;
  ipc: string;
  total: number;
}

const CommercialInvoiceTemplate = () => {
  const [currentDocument, setCurrentDocument] = useState<DocumentType>('factura');
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [documentNumber, setDocumentNumber] = useState('');
  const [taxRate, setTaxRate] = useState('14%');
  const [commercialDiscount, setCommercialDiscount] = useState(0);
  const [financialDiscount, setFinancialDiscount] = useState(0);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    // Set current date as default
    const invoiceDateInput = document.getElementById('dataFactura') as HTMLInputElement;
    if (invoiceDateInput) {
      invoiceDateInput.value = formattedDate;
    }
    
    // Set due date 30 days from today
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 30);
    const formattedDueDate = dueDate.toISOString().split('T')[0];
    
    const dueDateInput = document.getElementById('dataVencimento') as HTMLInputElement;
    if (dueDateInput) {
      dueDateInput.value = formattedDueDate;
    }
  }, []);

  const documentConfig = {
    factura: {
      title: 'FACTURA',
      numberLabel: 'Factura nº',
      docType: 'Original',
      dateLabel: 'Data Factura',
      dueDateLabel: 'Data Vencimento',
      clientLabel: 'Nome do Cliente',
      totalLabel: 'Total (AKZ)',
      showReference: false,
      showPayment: true,
      footerText: 'Todos os bens foram colocados à disposição do adquirente na data da factura\nProcessado por computador',
      headerClass: ''
    },
    recibo: {
      title: 'RECIBO',
      numberLabel: 'Recibo nº',
      docType: 'Via do Cliente',
      dateLabel: 'Data Recibo',
      dueDateLabel: 'Data Pagamento',
      clientLabel: 'Recebido de',
      totalLabel: 'Valor Recebido (AKZ)',
      showReference: false,
      showPayment: true,
      footerText: 'Valor recebido com agradecimento\nProcessado por computador',
      headerClass: 'bg-blue-100'
    },
    credito: {
      title: 'NOTA DE CRÉDITO',
      numberLabel: 'Nota de Crédito nº',
      docType: 'Original',
      dateLabel: 'Data Emissão',
      dueDateLabel: 'Data Aplicação',
      clientLabel: 'Cliente',
      totalLabel: 'Valor a Creditar (AKZ)',
      showReference: true,
      showPayment: false,
      footerText: 'Valor a creditar na conta corrente do cliente\nProcessado por computador',
      headerClass: 'bg-green-100'
    },
    debito: {
      title: 'NOTA DE DÉBITO',
      numberLabel: 'Nota de Débito nº',
      docType: 'Original',
      dateLabel: 'Data Emissão',
      dueDateLabel: 'Data Vencimento',
      clientLabel: 'Cliente',
      totalLabel: 'Valor a Debitar (AKZ)',
      showReference: true,
      showPayment: true,
      footerText: 'Valor a debitar na conta corrente do cliente\nProcessado por computador',
      headerClass: 'bg-red-100'
    },
    proforma: {
      title: 'FATURA PROFORMA',
      numberLabel: 'Proforma nº',
      docType: 'Cotação',
      dateLabel: 'Data Cotação',
      dueDateLabel: 'Validade',
      clientLabel: 'Cliente',
      totalLabel: 'Total Estimado (AKZ)',
      showReference: false,
      showPayment: true,
      footerText: 'Esta é uma cotação/orçamento - Não válida para efeitos fiscais\nProcessado por computador',
      headerClass: 'bg-yellow-100'
    },
    devolucao: {
      title: 'NOTA DE DEVOLUÇÃO',
      numberLabel: 'Devolução nº',
      docType: 'Original',
      dateLabel: 'Data Devolução',
      dueDateLabel: 'Data Recolha',
      clientLabel: 'Cliente',
      totalLabel: 'Valor Devolvido (AKZ)',
      showReference: true,
      showPayment: false,
      footerText: 'Mercadoria devolvida pelo cliente nas condições especificadas\nProcessado por computador',
      headerClass: 'bg-gray-100'
    }
  };

  const config = documentConfig[currentDocument];

  const addProductRow = () => {
    const newProduct: ProductRow = {
      id: Date.now().toString(),
      code: '',
      description: '',
      quantity: 1,
      unit: 'Un',
      unitPrice: 0,
      discount: '0',
      ipc: '14',
      total: 0
    };
    setProducts([...products, newProduct]);
  };

  const removeProductRow = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const updateProduct = (id: string, field: keyof ProductRow, value: string | number) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const updated = { ...product, [field]: value };
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return product;
    }));
  };

  const calculateTotals = () => {
    const subtotal = products.reduce((sum, product) => sum + product.total, 0);
    const netAmount = subtotal - commercialDiscount - financialDiscount;
    const taxRateNum = parseFloat(taxRate.replace('%', '')) / 100 || 0;
    const taxAmount = netAmount * taxRateNum;
    const grandTotal = netAmount + taxAmount;
    
    return { subtotal, netAmount, taxAmount, grandTotal };
  };

  const { subtotal, netAmount, taxAmount, grandTotal } = calculateTotals();

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const documentData = {
      documentType: currentDocument,
      documentNumber,
      products,
      totals: { subtotal, netAmount, taxAmount, grandTotal }
    };
    
    const blob = new Blob([JSON.stringify(documentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDocument}-${documentNumber || 'novo'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 p-5">
      {/* Document Selector */}
      <div className="max-w-4xl mx-auto mb-5 bg-white p-5 rounded-lg shadow-sm text-center">
        <h2 className="text-xl font-semibold mb-4">Selecione o Tipo de Documento</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.entries(documentConfig).map(([type, conf]) => (
            <Button
              key={type}
              variant={currentDocument === type ? "default" : "outline"}
              onClick={() => setCurrentDocument(type as DocumentType)}
              className="text-sm"
            >
              {conf.title}
            </Button>
          ))}
        </div>
      </div>

      {/* Invoice Container */}
      <div className="max-w-4xl mx-auto bg-white border-2 border-black shadow-lg">
        {/* Header */}
        <div className={`p-5 text-center border-b-2 border-black ${config.headerClass}`}>
          <h1 className="text-2xl font-bold text-gray-800">{config.title}</h1>
        </div>

        <div className="p-5">
          {/* Reference Section */}
          {config.showReference && (
            <div className="border border-black p-4 mb-5 bg-gray-50">
              <strong>Documento de Referência</strong>
              <table className="w-full border-collapse mt-2">
                <thead>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100">Tipo</th>
                    <th className="border border-black p-2 bg-gray-100">Número</th>
                    <th className="border border-black p-2 bg-gray-100">Data</th>
                    <th className="border border-black p-2 bg-gray-100">Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-1">
                      <Input className="border-0" placeholder="Fatura" />
                    </td>
                    <td className="border border-black p-1">
                      <Input className="border-0" placeholder="1/2025" />
                    </td>
                    <td className="border border-black p-1">
                      <Input type="date" className="border-0" />
                    </td>
                    <td className="border border-black p-1">
                      <Input className="border-0" placeholder="Descrição do motivo" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Company Information */}
          <div className="flex gap-5 mb-5">
            <div className="flex-1 border border-black p-4">
              <strong>Nome da Empresa</strong><br />
              <Input className="border-0 mt-1" placeholder="Digite a morada..." /><br />
              <Input className="border-0 mt-1" placeholder="Digite o telefone..." /><br />
              <Input className="border-0 mt-1" placeholder="Digite o nº contribuinte..." />
            </div>
            <div className="flex-1 border border-black p-4">
              <strong>{config.clientLabel}</strong><br />
              <Input className="border-0 mt-1" placeholder="Digite a morada do cliente..." /><br />
              <Input className="border-0 mt-1" placeholder="Digite o telefone do cliente..." />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="flex gap-5 mb-5">
            <div className="flex-1">
              <div className="mb-2">
                <strong>{config.numberLabel}</strong>
                <Input 
                  className="inline-block w-24 ml-2" 
                  placeholder="1/2025"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                />
              </div>
              <strong>{config.docType}</strong>
            </div>
            <div className="flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-black p-2 bg-gray-100 text-xs">Nº Requisição</th>
                    <th className="border border-black p-2 bg-gray-100 text-xs">Moeda</th>
                    <th className="border border-black p-2 bg-gray-100 text-xs">{config.dateLabel}</th>
                    <th className="border border-black p-2 bg-gray-100 text-xs">{config.dueDateLabel}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-1">
                      <Input className="border-0 text-xs" placeholder="Nº requisição" />
                    </td>
                    <td className="border border-black p-1">
                      <Select>
                        <SelectTrigger className="border-0 text-xs">
                          <SelectValue placeholder="AKZ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AKZ">AKZ</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="border border-black p-1">
                      <Input type="date" className="border-0 text-xs" id="dataFactura" />
                    </td>
                    <td className="border border-black p-1">
                      <Input type="date" className="border-0 text-xs" id="dataVencimento" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Button */}
          <Button onClick={addProductRow} className="mb-2">
            + Adicionar Produto
          </Button>

          {/* Products Table */}
          <table className="w-full border-collapse mb-5">
            <thead>
              <tr>
                <th className="border border-black p-2 bg-gray-100 text-xs">Cód. Artigo</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">Descrição</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">Qtd.</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">Un.</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">Pr. Unitário</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">Desc.</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">IPC</th>
                <th className="border border-black p-2 bg-gray-100 text-xs">Total Líquido</th>
                <th className="border border-black p-2 bg-gray-100 text-xs print:hidden">Ação</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="border border-black p-1">
                    <Input 
                      className="border-0 text-xs" 
                      value={product.code}
                      onChange={(e) => updateProduct(product.id, 'code', e.target.value)}
                    />
                  </td>
                  <td className="border border-black p-1">
                    <Input 
                      className="border-0 text-xs" 
                      value={product.description}
                      onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="border border-black p-1">
                    <Input 
                      type="number" 
                      className="border-0 text-xs" 
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border border-black p-1">
                    <Input 
                      className="border-0 text-xs" 
                      value={product.unit}
                      onChange={(e) => updateProduct(product.id, 'unit', e.target.value)}
                    />
                  </td>
                  <td className="border border-black p-1">
                    <Input 
                      type="number" 
                      className="border-0 text-xs" 
                      value={product.unitPrice}
                      onChange={(e) => updateProduct(product.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="border border-black p-1">
                    <Input 
                      className="border-0 text-xs" 
                      value={product.discount}
                      onChange={(e) => updateProduct(product.id, 'discount', e.target.value)}
                    />
                  </td>
                  <td className="border border-black p-1">
                    <Input 
                      className="border-0 text-xs" 
                      value={product.ipc}
                      onChange={(e) => updateProduct(product.id, 'ipc', e.target.value)}
                    />
                  </td>
                  <td className="border border-black p-1 text-xs text-center">
                    {product.total.toFixed(2)}
                  </td>
                  <td className="border border-black p-1 print:hidden">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeProductRow(product.id)}
                      className="text-xs"
                    >
                      ×
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr><th colSpan={2} className="border border-black p-2 bg-gray-100">Impostos</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2"><strong>Taxa</strong></td>
                    <td className="border border-black p-1">
                      <Input 
                        className="border-0" 
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"><strong>Incidência</strong></td>
                    <td className="border border-black p-1">
                      <Input className="border-0" value={netAmount.toFixed(2)} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"><strong>Valor</strong></td>
                    <td className="border border-black p-1">
                      <Input className="border-0" value={taxAmount.toFixed(2)} readOnly />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr><th colSpan={2} className="border border-black p-2 bg-gray-100">Resumo</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2"><strong>Mercadoria/Serviço</strong></td>
                    <td className="border border-black p-1">
                      <Input className="border-0" value={subtotal.toFixed(2)} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"><strong>Descontos Comerciais</strong></td>
                    <td className="border border-black p-1">
                      <Input 
                        type="number" 
                        className="border-0" 
                        value={commercialDiscount}
                        onChange={(e) => setCommercialDiscount(parseFloat(e.target.value) || 0)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"><strong>Descontos Financeiros</strong></td>
                    <td className="border border-black p-1">
                      <Input 
                        type="number" 
                        className="border-0" 
                        value={financialDiscount}
                        onChange={(e) => setFinancialDiscount(parseFloat(e.target.value) || 0)}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr><th colSpan={2} className="border border-black p-2 bg-gray-100">Total</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-black p-2"><strong>IPC</strong></td>
                    <td className="border border-black p-1">
                      <Input className="border-0" value={taxAmount.toFixed(2)} readOnly />
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-black p-2"><strong>{config.totalLabel}</strong></td>
                    <td className="border border-black p-1">
                      <Input className="border-0 font-bold" value={grandTotal.toFixed(2)} readOnly />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Details */}
          {config.showPayment && (
            <div className="border border-black p-4 mb-5">
              <strong>Forma de Pagamento</strong><br />
              <Select>
                <SelectTrigger className="w-48 mb-2">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dinheiro">Dinheiro</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                  <SelectItem value="tpa">TPA</SelectItem>
                </SelectContent>
              </Select><br />
              <strong>Coordenadas Bancárias</strong><br />
              <Input className="w-80 mb-1" placeholder="BFA (AKZ) - XXXXXXX" /><br />
              <Input className="w-80" placeholder="BFA (USD) - YYYYYY" />
            </div>
          )}

          {/* Footer Note */}
          <div className="border border-black p-3 bg-gray-50">
            <Textarea 
              className="border-0 resize-none text-xs bg-transparent"
              rows={2}
              value={config.footerText}
              readOnly
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-5 print:hidden">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button onClick={handleSave}>
              <Download className="h-4 w-4 mr-2" />
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialInvoiceTemplate;
