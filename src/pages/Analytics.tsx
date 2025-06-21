
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart, Calendar, FileText } from "lucide-react";
import { getAllStores, getAllProducts, getAllSalesData } from "@/data/storeData";
import { toast } from "sonner";

const Analytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedStore, setSelectedStore] = useState("all");

  // Sample analytics data
  const salesByMonth = [
    { name: 'Jan', vendas: 450000, produtos: 320 },
    { name: 'Fev', vendas: 520000, produtos: 380 },
    { name: 'Mar', vendas: 480000, produtos: 340 },
    { name: 'Abr', vendas: 620000, produtos: 450 },
    { name: 'Mai', vendas: 680000, produtos: 490 },
    { name: 'Jun', vendas: 750000, produtos: 520 }
  ];

  const salesByCategory = [
    { name: 'Alimentos', value: 45, color: '#3B82F6' },
    { name: 'Bebidas', value: 25, color: '#10B981' },
    { name: 'Limpeza', value: 15, color: '#F59E0B' },
    { name: 'Higiene', value: 10, color: '#EF4444' },
    { name: 'Outros', value: 5, color: '#8B5CF6' }
  ];

  const topProducts = [
    { name: 'Arroz Premium', vendas: 150, receita: 525000 },
    { name: 'Refrigerante Cola', vendas: 280, receita: 168000 },
    { name: 'Óleo de Cozinha', vendas: 95, receita: 190000 },
    { name: 'Feijão Preto', vendas: 120, receita: 336000 },
    { name: 'Macarrão Instantâneo', vendas: 200, receita: 180000 }
  ];

  const stores = getAllStores();
  const products = getAllProducts();

  const getAnalyticsStats = () => {
    const totalRevenue = salesByMonth.reduce((sum, month) => sum + month.vendas, 0);
    const totalProducts = salesByMonth.reduce((sum, month) => sum + month.produtos, 0);
    const avgTicket = totalRevenue / totalProducts;
    const monthlyGrowth = ((salesByMonth[5].vendas - salesByMonth[4].vendas) / salesByMonth[4].vendas) * 100;

    return {
      totalRevenue,
      totalProducts,
      avgTicket,
      monthlyGrowth
    };
  };

  const stats = getAnalyticsStats();

  const exportAnalytics = () => {
    const analyticsData = {
      periodo: selectedPeriod,
      loja: selectedStore,
      estatisticas: stats,
      vendasPorMes: salesByMonth,
      vendasPorCategoria: salesByCategory,
      produtosMaisVendidos: topProducts,
      dataExportacao: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Relatório de analytics exportado com sucesso!");
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-dark">Analytics e Relatórios</h1>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30days">30 dias</SelectItem>
              <SelectItem value="3months">3 meses</SelectItem>
              <SelectItem value="6months">6 meses</SelectItem>
              <SelectItem value="1year">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as lojas</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id.toString()}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportAnalytics}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('pt-BR')} Kz</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +{stats.monthlyGrowth.toFixed(1)}% vs mês anterior
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produtos Vendidos</p>
                <p className="text-2xl font-bold">{stats.totalProducts.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-blue-600">Últimos 6 meses</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ticket Médio</p>
                <p className="text-2xl font-bold">{stats.avgTicket.toLocaleString('pt-BR')} Kz</p>
                <p className="text-xs text-purple-600">Por transação</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lojas Ativas</p>
                <p className="text-2xl font-bold">{stores.length}</p>
                <p className="text-xs text-orange-600">Em operação</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString('pt-BR')} Kz`, 'Vendas']} />
                <Bar dataKey="vendas" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tendência de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`${Number(value).toLocaleString('pt-BR')} Kz`, 'Vendas']} />
                <Line type="monotone" dataKey="vendas" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Produtos Mais Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.vendas} unidades vendidas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{product.receita.toLocaleString('pt-BR')} Kz</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
