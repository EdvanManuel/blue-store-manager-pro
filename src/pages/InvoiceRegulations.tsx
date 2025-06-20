
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Receipt, Printer, Download } from "lucide-react";
import { toast } from "sonner";

const InvoiceRegulations = () => {
  const [invoiceData, setInvoiceData] = useState({
    companyName: "Nome da Empresa",
    companyAddress: "Morada da Empresa",
    companyPhone: "Telefone da Empresa",
    companyTaxNumber: "Nº de Contribuinte",
    clientName: "Nome do Cliente",
    clientAddress: "Morada do Cliente",
    clientPhone: "Telefone do Cliente",
    clientTaxNumber: "",
    invoiceNumber: "1/2016",
    currency: "AKZ",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    requisitionNumber: "",
    products: [
      { code: "", description: "", quantity: "", unit: "", unitPrice: "", discount: "", tax: "", total: "" }
    ],
    paymentMethod: "Pagamento a Dinheiro",
    bankDetails: "BFA (AKZ) - XXXXXX\nBFA (USD) - YYYYYY"
  });

  const handleInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductChange = (index: number, field: string, value: string) => {
    const newProducts = [...invoiceData.products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setInvoiceData(prev => ({
      ...prev,
      products: newProducts
    }));
  };

  const addProductRow = () => {
    setInvoiceData(prev => ({
      ...prev,
      products: [...prev.products, { code: "", description: "", quantity: "", unit: "", unitPrice: "", discount: "", tax: "", total: "" }]
    }));
  };

  const removeProductRow = (index: number) => {
    if (invoiceData.products.length > 1) {
      const newProducts = invoiceData.products.filter((_, i) => i !== index);
      setInvoiceData(prev => ({
        ...prev,
        products: newProducts
      }));
    }
  };

  const calculateProductTotal = (product: typeof invoiceData.products[0]) => {
    const quantity = parseFloat(product.quantity) || 0;
    const unitPrice = parseFloat(product.unitPrice) || 0;
    const discount = parseFloat(product.discount) || 0;
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const calculateTotal = () => {
    return invoiceData.products.reduce((sum, product) => {
      return sum + calculateProductTotal(product);
    }, 0);
  };

  const handlePrint = () => {
    window.print();
    toast.success("Factura enviada para impressão");
  };

  const handleSave = () => {
    toast.success("Factura guardada com sucesso");
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Receipt className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-dark">
            Editor de Factura
          </h1>
        </div>
        <div className="flex gap-2">
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Factura Editável
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Company and Client Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informações da Empresa</h3>
              <Input
                placeholder="Nome da Empresa"
                value={invoiceData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
              />
              <Input
                placeholder="Morada"
                value={invoiceData.companyAddress}
                onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              />
              <Input
                placeholder="Telefone"
                value={invoiceData.companyPhone}
                onChange={(e) => handleInputChange('companyPhone', e.target.value)}
              />
              <Input
                placeholder="Nº de Contribuinte"
                value={invoiceData.companyTaxNumber}
                onChange={(e) => handleInputChange('companyTaxNumber', e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informações do Cliente</h3>
              <Input
                placeholder="Nome do Cliente"
                value={invoiceData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
              />
              <Input
                placeholder="Morada"
                value={invoiceData.clientAddress}
                onChange={(e) => handleInputChange('clientAddress', e.target.value)}
              />
              <Input
                placeholder="Telefone"
                value={invoiceData.clientPhone}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
              />
              <Input
                placeholder="Nº de Contribuinte"
                value={invoiceData.clientTaxNumber}
                onChange={(e) => handleInputChange('clientTaxNumber', e.target.value)}
              />
            </div>
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Input
              placeholder="Nº Requisição"
              value={invoiceData.requisitionNumber}
              onChange={(e) => handleInputChange('requisitionNumber', e.target.value)}
            />
            <Input
              value={invoiceData.currency}
              onChange={(e) => handleInputChange('currency', e.target.value)}
            />
            <Input
              type="date"
              value={invoiceData.invoiceDate}
              onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
            />
            <Input
              type="date"
              value={invoiceData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
            />
            <Input
              placeholder="Factura nº"
              value={invoiceData.invoiceNumber}
              onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            />
          </div>

          {/* Products Table */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">Produtos/Serviços</h3>
              <Button onClick={addProductRow} size="sm">
                Adicionar Linha
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-300 p-2 text-xs">Cód. Artigo</th>
                    <th className="border border-gray-300 p-2 text-xs">Descrição</th>
                    <th className="border border-gray-300 p-2 text-xs">Qtd.</th>
                    <th className="border border-gray-300 p-2 text-xs">Un.</th>
                    <th className="border border-gray-300 p-2 text-xs">Pr. Unitário</th>
                    <th className="border border-gray-300 p-2 text-xs">Desc. %</th>
                    <th className="border border-gray-300 p-2 text-xs">IPC %</th>
                    <th className="border border-gray-300 p-2 text-xs">Total</th>
                    <th className="border border-gray-300 p-2 text-xs">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.products.map((product, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          value={product.code}
                          onChange={(e) => handleProductChange(index, 'code', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          value={product.description}
                          onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          type="number"
                          value={product.quantity}
                          onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          value={product.unit}
                          onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          type="number"
                          value={product.unitPrice}
                          onChange={(e) => handleProductChange(index, 'unitPrice', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          type="number"
                          value={product.discount}
                          onChange={(e) => handleProductChange(index, 'discount', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Input
                          size="sm"
                          type="number"
                          value={product.tax}
                          onChange={(e) => handleProductChange(index, 'tax', e.target.value)}
                          className="border-0 text-xs"
                        />
                      </td>
                      <td className="border border-gray-300 p-1 text-xs text-center">
                        {calculateProductTotal(product).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 p-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeProductRow(index)}
                          className="text-xs"
                        >
                          ×
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Information and Totals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Forma de Pagamento</h3>
              <Input
                value={invoiceData.paymentMethod}
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-1">Coordenadas Bancárias</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                  rows={3}
                  value={invoiceData.bankDetails}
                  onChange={(e) => handleInputChange('bankDetails', e.target.value)}
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

          <div className="mt-6 text-xs text-gray-600">
            <p>Todos os bens foram colocados à disposição do adquirente na data da factura</p>
            <p className="font-semibold">Processado por computador</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceRegulations;
