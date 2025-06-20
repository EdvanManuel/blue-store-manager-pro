
import { useState } from "react";
import { Edit, Phone, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store } from "@/data/storeData";

interface StoreInfoCardProps {
  store: Store;
  onStoreUpdate: (updatedStore: Store) => void;
  onCallStore: () => void;
}

const StoreInfoCard = ({ store, onStoreUpdate, onCallStore }: StoreInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Store>({ ...store });

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStoreUpdate(editFormData);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detalhes da Loja</CardTitle>
          {!isEditing ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Loja</Label>
              <Input 
                id="name" 
                name="name" 
                value={editFormData.name} 
                onChange={handleEditFormChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input 
                id="address" 
                name="address" 
                value={editFormData.address} 
                onChange={handleEditFormChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={editFormData.phone} 
                onChange={handleEditFormChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={editFormData.email} 
                onChange={handleEditFormChange} 
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setEditFormData({ ...store });
                setIsEditing(false);
              }}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-1" /> Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Label className="text-gray-500">Nome da Loja</Label>
              <div className="font-semibold">{store.name}</div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label className="text-gray-500">Endereço</Label>
              <div className="font-semibold">{store.address}</div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label className="text-gray-500">Telefone</Label>
              <div className="font-semibold flex items-center">
                {store.phone}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 text-blue-light" 
                  onClick={onCallStore}
                >
                  <Phone className="h-4 w-4" />
                  <span className="ml-1">Ligar</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label className="text-gray-500">E-mail</Label>
              <div className="font-semibold">
                <a href={`mailto:${store.email}`} className="text-blue-light hover:underline">
                  {store.email}
                </a>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StoreInfoCard;
