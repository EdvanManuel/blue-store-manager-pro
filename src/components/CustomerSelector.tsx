
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User } from "lucide-react";
import { useCustomerManagement, Customer } from "@/hooks/useCustomerManagement";
import { toast } from "sonner";

interface CustomerSelectorProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

const CustomerSelector = ({ selectedCustomer, onCustomerSelect }: CustomerSelectorProps) => {
  const { customers, addCustomer } = useCustomerManagement();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    taxNumber: '',
    email: ''
  });

  const handleAddCustomer = () => {
    if (!newCustomer.name) {
      toast.error('Nome do cliente é obrigatório');
      return;
    }

    const customer = addCustomer(newCustomer);
    onCustomerSelect(customer);
    setNewCustomer({ name: '', address: '', phone: '', taxNumber: '', email: '' });
    setShowAddDialog(false);
    toast.success('Cliente adicionado com sucesso');
  };

  const handleCustomerChange = (customerId: string) => {
    if (customerId === 'new') {
      setShowAddDialog(true);
      return;
    }
    
    const customer = customers.find(c => c.id.toString() === customerId) || null;
    onCustomerSelect(customer);
  };

  return (
    <div className="space-y-2">
      <Label>Cliente</Label>
      <div className="flex gap-2">
        <Select 
          value={selectedCustomer?.id.toString() || ""} 
          onValueChange={handleCustomerChange}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id.toString()}>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {customer.name}
                  {customer.id === 1 && (
                    <span className="text-xs text-gray-500">(Diverso)</span>
                  )}
                </div>
              </SelectItem>
            ))}
            <SelectItem value="new">
              <div className="flex items-center gap-2 text-blue-600">
                <Plus className="h-4 w-4" />
                Adicionar novo cliente
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome *</Label>
              <Input
                id="customerName"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Morada</Label>
              <Input
                id="customerAddress"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                placeholder="Endereço do cliente"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Telefone</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  placeholder="Telefone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerTax">NIF</Label>
                <Input
                  id="customerTax"
                  value={newCustomer.taxNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, taxNumber: e.target.value })}
                  placeholder="Número de contribuinte"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                placeholder="Email do cliente"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddCustomer}>
                Adicionar Cliente
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerSelector;
