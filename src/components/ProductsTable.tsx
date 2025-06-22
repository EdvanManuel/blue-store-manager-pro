
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

interface ProductsTableProps {
  products: Product[];
  onProductChange: (index: number, field: string, value: string | number) => void;
  onAddProductRow: () => void;
  onRemoveProductRow: (index: number) => void;
  calculateProductTotal: (product: Product) => number;
}

const ProductsTable = ({ 
  products, 
  onProductChange, 
  onAddProductRow, 
  onRemoveProductRow, 
  calculateProductTotal 
}: ProductsTableProps) => {
  const handleNumericChange = (index: number, field: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    onProductChange(index, field, numericValue);
  };

  const handleTextChange = (index: number, field: string, value: string) => {
    onProductChange(index, field, value);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Produtos/Serviços</h3>
        <Button onClick={onAddProductRow} size="sm">
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
            {products.map((product, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    value={product.code}
                    onChange={(e) => handleTextChange(index, 'code', e.target.value)}
                    className="border-0 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    value={product.description}
                    onChange={(e) => handleTextChange(index, 'description', e.target.value)}
                    className="border-0 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    type="number"
                    value={product.quantity.toString()}
                    onChange={(e) => handleNumericChange(index, 'quantity', e.target.value)}
                    className="border-0 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    value={product.unit}
                    onChange={(e) => handleTextChange(index, 'unit', e.target.value)}
                    className="border-0 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    type="number"
                    value={product.unitPrice.toString()}
                    onChange={(e) => handleNumericChange(index, 'unitPrice', e.target.value)}
                    className="border-0 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    type="number"
                    value={product.discount.toString()}
                    onChange={(e) => handleNumericChange(index, 'discount', e.target.value)}
                    className="border-0 text-xs"
                  />
                </td>
                <td className="border border-gray-300 p-1">
                  <Input
                    size="sm"
                    type="number"
                    value={product.tax.toString()}
                    onChange={(e) => handleNumericChange(index, 'tax', e.target.value)}
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
                    onClick={() => onRemoveProductRow(index)}
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
  );
};

export default ProductsTable;
