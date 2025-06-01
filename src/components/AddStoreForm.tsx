
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "@/data/storeData";

interface AddStoreFormProps {
  onStoreAdded: (store: Store) => void;
  onCancel: () => void;
}

const AddStoreForm = ({ onStoreAdded, onCancel }: AddStoreFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const newStore: Store = {
      id: Date.now(),
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      monthlySales: 0,
      criticalStock: 0,
      expiringProducts: 0
    };

    onStoreAdded(newStore);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Adicionar Nova Loja</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="store-name">Nome da Loja *</Label>
              <Input
                id="store-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Loja Centro"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="store-phone">Telefone *</Label>
              <Input
                id="store-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Ex: +244 974334771"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="store-address">Endereço *</Label>
              <Input
                id="store-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Ex: Rua Principal 123, Centro"
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="store-email">E-mail *</Label>
              <Input
                id="store-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Ex: loja@exemplo.com"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar Loja
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddStoreForm;
