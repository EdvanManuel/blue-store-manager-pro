
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/data/storeData";

interface EditProductFormProps {
  product: Product;
  onProductUpdated: (product: Product) => void;
  onCancel: () => void;
}

const EditProductForm = ({ product, onProductUpdated, onCancel }: EditProductFormProps) => {
  const [formData, setFormData] = useState({
    name: product.name,
    code: product.code,
    category: product.category,
    costPrice: product.costPrice.toString(),
    sellingPrice: product.sellingPrice.toString(),
    quantity: product.quantity.toString(),
    expiryDate: product.expiryDate
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.category || !formData.costPrice || !formData.sellingPrice || !formData.quantity || !formData.expiryDate) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const updatedProduct: Product = {
      ...product,
      name: formData.name,
      code: formData.code,
      category: formData.category,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      expiryDate: formData.expiryDate
    };

    onProductUpdated(updatedProduct);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Editar Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nome do Produto *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-code">Código *</Label>
              <Input
                id="edit-code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Categoria *</Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alimentos">Alimentos</SelectItem>
                  <SelectItem value="Bebidas">Bebidas</SelectItem>
                  <SelectItem value="Laticínios">Laticínios</SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Higiene">Higiene</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantidade *</Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-costPrice">Preço de Custo (Kz) *</Label>
              <Input
                id="edit-costPrice"
                name="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-sellingPrice">Preço de Venda (Kz) *</Label>
              <Input
                id="edit-sellingPrice"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="edit-expiryDate">Data de Validade *</Label>
              <Input
                id="edit-expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Atualizar Produto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditProductForm;
