
import { useState } from "react";
import InvoiceHeader from "@/components/InvoiceHeader";
import CompanyClientInfo from "@/components/CompanyClientInfo";
import InvoiceDetails from "@/components/InvoiceDetails";
import ProductsTable from "@/components/ProductsTable";
import PaymentSummary from "@/components/PaymentSummary";
import InvoiceFooter from "@/components/InvoiceFooter";

interface Product {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface InvoiceData {
  requisitionNumber: string;
  currency: string;
  invoiceDate: string;
  dueDate: string;
  invoiceNumber: string;
}

interface CompanyInfo {
  name: string;
  address: string;
  nif: string;
  phone: string;
  email: string;
}

const InvoiceRegulations = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    requisitionNumber: '',
    currency: 'AOA',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    invoiceNumber: ''
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'Nome da Empresa',
    address: 'Endereço da Empresa',
    nif: 'NIF da Empresa',
    phone: 'Telefone',
    email: 'email@empresa.com'
  });

  const [clientInfo, setClientInfo] = useState<CompanyInfo>({
    name: 'Nome do Cliente',
    address: 'Endereço do Cliente',
    nif: 'NIF do Cliente',
    phone: 'Telefone do Cliente',
    email: 'cliente@email.com'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const invoiceBlob = new Blob([JSON.stringify({
      invoiceData,
      companyInfo,
      clientInfo,
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

  const handleInvoiceInputChange = (field: string, value: string) => {
    setInvoiceData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyInputChange = (field: string, value: string) => {
    setCompanyInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleClientInputChange = (field: string, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }));
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: number, field: string, value: string | number) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedProduct.total = updatedProduct.quantity * updatedProduct.unitPrice;
        }
        return updatedProduct;
      }
      return product;
    }));
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const subtotal = products.reduce((sum, product) => sum + product.total, 0);
  const tax = subtotal * 0.14; // 14% IVA
  const total = subtotal + tax;

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-white">
      <InvoiceHeader onPrint={handlePrint} onSave={handleSave} />
      
      <CompanyClientInfo
        companyInfo={companyInfo}
        clientInfo={clientInfo}
        onCompanyChange={handleCompanyInputChange}
        onClientChange={handleClientInputChange}
      />

      <InvoiceDetails
        invoiceData={invoiceData}
        onInputChange={handleInvoiceInputChange}
      />

      <ProductsTable
        products={products}
        onAddProduct={addProduct}
        onUpdateProduct={updateProduct}
        onRemoveProduct={removeProduct}
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
