
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { toast } from "sonner";
import InvoiceHeader from "@/components/InvoiceHeader";
import CompanyClientInfo from "@/components/CompanyClientInfo";
import InvoiceDetails from "@/components/InvoiceDetails";
import ProductsTable from "@/components/ProductsTable";
import PaymentSummary from "@/components/PaymentSummary";
import InvoiceFooter from "@/components/InvoiceFooter";

interface Product {
  code: string;
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
  discount: string;
  tax: string;
  total: string;
}

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
    ] as Product[],
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

  const calculateProductTotal = (product: Product): number => {
    const quantity = parseFloat(product.quantity) || 0;
    const unitPrice = parseFloat(product.unitPrice) || 0;
    const discount = parseFloat(product.discount) || 0;
    const subtotal = quantity * unitPrice;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const calculateTotal = (): number => {
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
      <InvoiceHeader onPrint={handlePrint} onSave={handleSave} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Factura Editável
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyClientInfo 
            invoiceData={invoiceData} 
            onInputChange={handleInputChange} 
          />
          
          <InvoiceDetails 
            invoiceData={invoiceData} 
            onInputChange={handleInputChange} 
          />

          <ProductsTable
            products={invoiceData.products}
            onProductChange={handleProductChange}
            onAddProductRow={addProductRow}
            onRemoveProductRow={removeProductRow}
            calculateProductTotal={calculateProductTotal}
          />

          <PaymentSummary
            invoiceData={invoiceData}
            onInputChange={handleInputChange}
            calculateTotal={calculateTotal}
          />

          <InvoiceFooter />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceRegulations;
