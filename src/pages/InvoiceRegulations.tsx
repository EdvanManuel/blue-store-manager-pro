
import { useState } from "react";
import InvoiceHeader from "@/components/InvoiceHeader";
import CompanyClientInfo from "@/components/CompanyClientInfo";
import InvoiceDetails from "@/components/InvoiceDetails";
import ProductsTable from "@/components/ProductsTable";
import PaymentSummary from "@/components/PaymentSummary";
import InvoiceFooter from "@/components/InvoiceFooter";

interface Product {
  code: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

interface InvoiceData {
  requisitionNumber: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  invoiceNumber: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyTaxNumber: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  clientTaxNumber: string;
}

const InvoiceRegulations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    requisitionNumber: '',
    currency: 'AOA',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    invoiceNumber: '',
    companyName: 'Nome da Empresa',
    companyAddress: 'Endereço da Empresa',
    companyPhone: 'Telefone',
    companyTaxNumber: 'NIF da Empresa',
    clientName: 'Nome do Cliente',
    clientAddress: 'Endereço do Cliente',
    clientPhone: 'Telefone do Cliente',
    clientTaxNumber: 'NIF do Cliente'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const invoiceBlob = new Blob([JSON.stringify({
      invoiceData,
      products
    })], { type: 'application/json' });
    
    const url = URL.createObjectURL(invoiceBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factura-${invoiceData.invoiceNumber || 'nova'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const addProductRow = () => {
    const newProduct: Product = {
      code: '',
      description: '',
      quantity: 1,
      unit: 'Un',
      unitPrice: 0,
      discount: 0,
      tax: 14,
      total: 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (index: number, field: string, value: string | number) => {
    setProducts(products.map((product, i) => {
      if (i === index) {
        const updatedProduct = { ...product, [field]: value };
        // Recalcular total quando quantidade, preço ou desconto mudarem
        if (field === 'quantity' || field === 'unitPrice' || field === 'discount') {
          const qty = typeof updatedProduct.quantity === 'number' ? updatedProduct.quantity : parseFloat(updatedProduct.quantity.toString()) || 0;
          const price = typeof updatedProduct.unitPrice === 'number' ? updatedProduct.unitPrice : parseFloat(updatedProduct.unitPrice.toString()) || 0;
          const discount = typeof updatedProduct.discount === 'number' ? updatedProduct.discount : parseFloat(updatedProduct.discount.toString()) || 0;
          const subtotal = qty * price;
          const discountAmount = subtotal * (discount / 100);
          updatedProduct.total = subtotal - discountAmount;
        }
        return updatedProduct;
      }
      return product;
    }));
  };

  const removeProductRow = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const calculateProductTotal = (product: Product): number => {
    const qty = typeof product.quantity === 'number' ? product.quantity : parseFloat(product.quantity.toString()) || 0;
    const price = typeof product.unitPrice === 'number' ? product.unitPrice : parseFloat(product.unitPrice.toString()) || 0;
    const discount = typeof product.discount === 'number' ? product.discount : parseFloat(product.discount.toString()) || 0;
    const subtotal = qty * price;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  const subtotal = products.reduce((sum, product) => sum + calculateProductTotal(product), 0);
  const tax = subtotal * 0.14; // 14% IVA
  const total = subtotal + tax;

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white">
      <InvoiceHeader onPrint={handlePrint} onSave={handleSave} />
      
      <CompanyClientInfo
        invoiceData={invoiceData}
        onInputChange={handleInputChange}
      />

      <InvoiceDetails
        invoiceData={invoiceData}
        onInputChange={handleInputChange}
      />

      <ProductsTable
        products={products}
        onAddProductRow={addProductRow}
        onProductChange={updateProduct}
        onRemoveProductRow={removeProductRow}
        calculateProductTotal={calculateProductTotal}
      />

      <PaymentSummary
        subtotal={subtotal}
        tax={tax}
        total={total}
      />

      <InvoiceFooter />
    </div>
  );
};

export default InvoiceRegulations;
