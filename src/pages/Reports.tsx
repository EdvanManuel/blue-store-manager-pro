
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { stores, salesData, products, hasLowStock, isCloseToExpiry, daysUntilExpiry } from "@/data/storeData";

const colors = ['#3B82F6', '#1E3A8A', '#60A5FA', '#93C5FD', '#BFDBFE'];
const RADIAN = Math.PI / 180;

// Custom label for pie chart
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const Reports = () => {
  const [timeframe, setTimeframe] = useState("month");

  // Prepare data for revenue by store chart
  const revenueByStoreData = stores.map(store => ({
    name: store.name,
    revenue: store.monthlySales
  }));

  // Prepare data for revenue over time chart
  const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho"];
  const revenueOverTimeData = months.map(month => {
    const item: any = { name: month };
    stores.forEach(store => {
      const storeData = salesData.find(
        data => data.storeId === store.id && data.month === month
      );
      item[store.name] = storeData ? storeData.amount : 0;
    });
    return item;
  });

  // Prepare data for top products categories chart
  const categoryCounts: Record<string, number> = {};
  products.forEach(product => {
    if (categoryCounts[product.category]) {
      categoryCounts[product.category]++;
    } else {
      categoryCounts[product.category] = 1;
    }
  });

  const topCategoriesData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  // Get products with low stock
  const lowStockProducts = products.filter(product => hasLowStock(product.quantity));

  // Get products close to expiry
  const expiringProducts = products
    .filter(product => isCloseToExpiry(product.expiryDate))
    .sort((a, b) => daysUntilExpiry(a.expiryDate) - daysUntilExpiry(b.expiryDate));

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left text-blue-dark">
        Relatórios Gerais
      </h1>
      
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:justify-between">
        <div className="w-full md:w-auto">
          <Label htmlFor="timeframe">Período de Análise</Label>
          <Select defaultValue={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última Semana</SelectItem>
              <SelectItem value="month">Último Mês</SelectItem>
              <SelectItem value="year">Último Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 grid grid-cols-1 md:grid-cols-3 w-full">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="inventory">Inventário</TabsTrigger>
          <TabsTrigger value="financial">Análise Financeira</TabsTrigger>
        </TabsList>
      
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Faturamento por Loja</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={revenueByStoreData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString('pt-BR')} Kz`} />
                      <Legend />
                      <Bar dataKey="revenue" name="Faturamento (Kz)" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topCategoriesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topCategoriesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} produtos`, 'Quantidade']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Evolução de Faturamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueOverTimeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${Number(value).toLocaleString('pt-BR')} Kz`} />
                      <Legend />
                      {stores.map((store, index) => (
                        <Line
                          key={store.id}
                          type="monotone"
                          dataKey={store.name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Produtos com Estoque Crítico</CardTitle>
              </CardHeader>
              <CardContent>
                {lowStockProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-dark text-white">
                          <th className="px-4 py-2 text-left">Produto</th>
                          <th className="px-4 py-2 text-center">Loja</th>
                          <th className="px-4 py-2 text-center">Estoque</th>
                          <th className="px-4 py-2 text-right">Preço de Venda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lowStockProducts.map((product) => {
                          const storeInfo = stores.find(s => s.id === product.storeId);
                          return (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2">{product.name}</td>
                              <td className="px-4 py-2 text-center">{storeInfo?.name}</td>
                              <td className="px-4 py-2 text-center">
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                  {product.quantity}
                                </span>
                              </td>
                              <td className="px-4 py-2 text-right">{product.sellingPrice.toLocaleString('pt-BR')} Kz</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Nenhum produto com estoque crítico encontrado.
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Produtos Próximos da Expiração</CardTitle>
              </CardHeader>
              <CardContent>
                {expiringProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-blue-dark text-white">
                          <th className="px-4 py-2 text-left">Produto</th>
                          <th className="px-4 py-2 text-center">Loja</th>
                          <th className="px-4 py-2 text-center">Dias até Expiração</th>
                          <th className="px-4 py-2 text-center">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expiringProducts.map((product) => {
                          const storeInfo = stores.find(s => s.id === product.storeId);
                          const days = daysUntilExpiry(product.expiryDate);
                          return (
                            <tr key={product.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-2">{product.name}</td>
                              <td className="px-4 py-2 text-center">{storeInfo?.name}</td>
                              <td className="px-4 py-2 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  days <= 10 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {days} dias
                                </span>
                              </td>
                              <td className="px-4 py-2 text-center">{product.quantity}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    Nenhum produto próximo da expiração encontrado.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Financial Analysis Tab */}
        <TabsContent value="financial">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Faturamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stores.map((store, index) => {
                    if (index === 0) return null;
                    
                    const previousStore = stores[index - 1];
                    const difference = store.monthlySales - previousStore.monthlySales;
                    const percentageDiff = (difference / previousStore.monthlySales) * 100;
                    const isPositive = difference > 0;
                    
                    return (
                      <div key={store.id} className="p-4 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-medium mb-2">
                          {store.name} vs {previousStore.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? '+' : ''}{percentageDiff.toFixed(2)}%
                          </span>
                          <span className="text-gray-500">
                            ({isPositive ? '+' : ''}{difference.toLocaleString('pt-BR')} Kz)
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {store.name} tem {isPositive ? 'mais' : 'menos'} faturamento que {previousStore.name}.
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Análise de Riscos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Low Stock Risk */}
                  <div className="p-4 rounded-lg bg-red-50">
                    <h3 className="text-lg font-medium mb-2">
                      Risco de Estoque Baixo
                    </h3>
                    <div className="text-2xl font-bold text-red-600">
                      {lowStockProducts.reduce((sum, product) => sum + product.costPrice, 0).toLocaleString('pt-BR')} Kz
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Valor total de produtos com estoque crítico que precisam ser repostos.
                    </p>
                  </div>
                  
                  {/* Expiration Risk */}
                  <div className="p-4 rounded-lg bg-amber-50">
                    <h3 className="text-lg font-medium mb-2">
                      Risco de Expiração
                    </h3>
                    <div className="text-2xl font-bold text-amber-600">
                      {expiringProducts.reduce((sum, product) => sum + (product.costPrice * product.quantity), 0).toLocaleString('pt-BR')} Kz
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Valor total de produtos que expiram nos próximos 30 dias.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
