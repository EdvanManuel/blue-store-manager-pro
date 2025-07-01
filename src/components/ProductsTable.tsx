
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

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
  onAddProductRow: () => void;
  onProductChange: (index: number, field: string, value: string | number) => void;
  onRemoveProductRow: (index: number) => void;
  calculateProductTotal: (product: Product) => number;
}

const ProductsTable = ({ 
  products, 
  onAddProductRow, 
  onProductChange, 
  onRemoveProductRow, 
  calculateProductTotal 
}: ProductsTableProps) => {
  const handleInputChange = (index: number, field: string, value: string) => {
    // Convert numeric fields to numbers
    if (['quantity', 'unitPrice', 'discount', 'tax'].includes(field)) {
      const numericValue = parseFloat(value) || 0;
      onProductChange(index, field, numericValue);
    } else {
      onProductChange(index, field, value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Produtos e Serviços</h3>
        <Button onClick={onAddProductRow} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Linha
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="w-[80px]">Qtd</TableHead>
              <TableHead className="w-[80px]">Un.</TableHead>
              <TableHead className="w-[120px]">Preço Unit.</TableHead>
              <TableHead className="w-[80px]">Desc. %</TableHead>
              <TableHead className="w-[80px]">IVA %</TableHead>
              <TableHead className="w-[120px]">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={product.code}
                    onChange={(e) => handleInputChange(index, 'code', e.target.value)}
                    placeholder="Código"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={product.description}
                    onChange={(e) => handleInputChange(index, 'description', e.target.value)}
                    placeholder="Descrição do produto"
                    className="w-full"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                    className="w-full"
                    min="0"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Select value={product.unit} onValueChange={(value) => onProductChange(index, 'unit', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Un">Un</SelectItem>
                      <SelectItem value="Kg">Kg</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="m">m</SelectItem>
                      <SelectItem value="m²">m²</SelectItem>
                      <SelectItem value="Cx">Cx</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={product.unitPrice}
                    onChange={(e) => handleInputChange(index, 'unitPrice', e.target.value)}
                    className="w-full"
                    min="0"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={product.discount}
                    onChange={(e) => handleInputChange(index, 'discount', e.target.value)}
                    className="w-full"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    value={product.tax}
                    onChange={(e) => handleInputChange(index, 'tax', e.target.value)}
                    className="w-full"
                    min="0"
                    step="0.01"
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">
                    {calculateProductTotal(product).toFixed(2)} Kz
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => onRemoveProductRow(index)}
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                  Nenhum produto adicionado. Clique em "Adicionar Linha" para começar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ProductsTable;
