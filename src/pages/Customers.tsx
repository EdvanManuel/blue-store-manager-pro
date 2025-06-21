
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Search, Phone, Mail, MapPin, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  totalPurchases: number;
  lastPurchase: string;
  purchaseCount: number;
  status: 'active' | 'inactive';
  registrationDate: string;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    taxNumber: ''
  });

  // Sample customers data
  useEffect(() => {
    const sampleCustomers: Customer[] = [
      {
        id: 1,
        name: "João Silva",
        phone: "+244 974334771",
        email: "joao@email.com",
        address: "Rua das Flores, 123",
        taxNumber: "123456789",
        totalPurchases: 450000,
        lastPurchase: "2025-06-15",
        purchaseCount: 12,
        status: 'active',
        registrationDate: "2025-01-15"
      },
      {
        id: 2,
        name: "Maria Santos",
        phone: "+244 974334772",
        email: "maria@email.com",
        address: "Avenida Central, 456",
        taxNumber: "987654321",
        totalPurchases: 780000,
        lastPurchase: "2025-06-20",
        purchaseCount: 25,
        status: 'active',
        registrationDate: "2024-11-20"
      },
      {
        id: 3,
        name: "Pedro Costa",
        phone: "+244 974334773",
        email: "pedro@email.com",
        address: "Bairro Novo, 789",
        taxNumber: "456789123",
        totalPurchases: 120000,
        lastPurchase: "2025-05-10",
        purchaseCount: 5,
        status: 'inactive',
        registrationDate: "2025-03-10"
      }
    ];
    setCustomers(sampleCustomers);
    setFilteredCustomers(sampleCustomers);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(customers);
    }
  }, [searchTerm, customers]);

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Nome e telefone são obrigatórios");
      return;
    }

    const customer: Customer = {
      id: Date.now(),
      ...newCustomer,
      totalPurchases: 0,
      lastPurchase: '',
      purchaseCount: 0,
      status: 'active',
      registrationDate: new Date().toISOString().split('T')[0]
    };

    setCustomers(prev => [customer, ...prev]);
    setNewCustomer({
      name: '',
      phone: '',
      email: '',
      address: '',
      taxNumber: ''
    });
    setIsAddingCustomer(false);
    toast.success("Cliente adicionado com sucesso!");
  };

  const getCustomerStats = () => {
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalSales = customers.reduce((sum, c) => sum + c.totalPurchases, 0);
    const avgPurchaseValue = totalSales / customers.reduce((sum, c) => sum + c.purchaseCount, 0) || 0;

    return { totalCustomers, activeCustomers, totalSales, avgPurchaseValue };
  };

  const stats = getCustomerStats();

  const exportCustomers = () => {
    const csvContent = [
      ['Nome', 'Telefone', 'Email', 'Endereço', 'NIF', 'Total Compras', 'Última Compra', 'Nº Compras', 'Status', 'Data Registro'].join(','),
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.phone,
        customer.email,
        customer.address,
        customer.taxNumber,
        customer.totalPurchases.toFixed(2),
        customer.lastPurchase || 'Nunca',
        customer.purchaseCount,
        customer.status === 'active' ? 'Ativo' : 'Inativo',
        new Date(customer.registrationDate).toLocaleDateString('pt-BR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Lista de clientes exportada com sucesso!");
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-dark">Gestão de Clientes</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportCustomers} variant="outline">
            Exportar Lista
          </Button>
          <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+244 974334771"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Endereço</Label>
                  <Input
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Endereço completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número de Contribuinte</Label>
                  <Input
                    value={newCustomer.taxNumber}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, taxNumber: e.target.value }))}
                    placeholder="NIF"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddCustomer} className="flex-1">
                    Adicionar Cliente
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddingCustomer(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeCustomers}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vendas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSales.toLocaleString('pt-BR')} Kz</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgPurchaseValue.toLocaleString('pt-BR')} Kz</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar clientes por nome, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Clientes ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Cliente</th>
                  <th className="text-left p-2">Contato</th>
                  <th className="text-left p-2">Endereço</th>
                  <th className="text-right p-2">Total Compras</th>
                  <th className="text-center p-2">Nº Compras</th>
                  <th className="text-center p-2">Última Compra</th>
                  <th className="text-center p-2">Status</th>
                  <th className="text-center p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        {customer.taxNumber && (
                          <p className="text-sm text-gray-500">NIF: {customer.taxNumber}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                        {customer.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-sm">{customer.email}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2">
                      {customer.address && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">{customer.address}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-2 text-right font-medium">
                      {customer.totalPurchases.toLocaleString('pt-BR')} Kz
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant="outline">{customer.purchaseCount}</Badge>
                    </td>
                    <td className="p-2 text-center text-sm">
                      {customer.lastPurchase ? 
                        new Date(customer.lastPurchase).toLocaleDateString('pt-BR') : 
                        'Nunca'
                      }
                    </td>
                    <td className="p-2 text-center">
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex gap-1 justify-center">
                        <Button size="sm" variant="ghost" onClick={() => window.location.href = `tel:${customer.phone}`}>
                          <Phone className="h-3 w-3" />
                        </Button>
                        {customer.email && (
                          <Button size="sm" variant="ghost" onClick={() => window.location.href = `mailto:${customer.email}`}>
                            <Mail className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
