
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product } from "@/data/storeData";

interface AddProductFormProps {
  storeId: number;
  onProductAdded: (product: Product) => void;
  onCancel: () => void;
}

const AddProductForm = ({ storeId, onProductAdded, onCancel }: AddProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    costPrice: '',
    sellingPrice: '',
    quantity: '',
    expiryDate: ''
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

    const newProduct: Product = {
      id: Date.now(), // Simple ID generation
      storeId,
      name: formData.name,
      code: formData.code,
      category: formData.category,
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      quantity: Number(formData.quantity),
      entryDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate
    };

    onProductAdded(newProduct);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Adicionar Novo Produto</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Arroz Premium"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Código *</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                placeholder="Ex: ARR001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select onValueChange={handleCategoryChange} required>
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
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Ex: 50"
                min="0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Preço de Custo (Kz) *</Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={handleInputChange}
                placeholder="Ex: 2000"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Preço de Venda (Kz) *</Label>
              <Input
                id="sellingPrice"
                name="sellingPrice"
                type="number"
                value={formData.sellingPrice}
                onChange={handleInputChange}
                placeholder="Ex: 3500"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="expiryDate">Data de Validade *</Label>
              <Input
                id="expiryDate"
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
              Adicionar Produto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddProductForm;
