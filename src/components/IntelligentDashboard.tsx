
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

const IntelligentDashboard = () => {
  const { systemAnalytics, refreshAnalytics } = useAnalytics();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    refreshAnalytics();
  }, []);

  if (isLoading || !systemAnalytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => `${value.toLocaleString('pt-BR')} Kz`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const efficiencyScore = Math.min(100, 
    (systemAnalytics.totalProducts * 5) + 
    (systemAnalytics.avgProfitMargin * 2) + 
    (systemAnalytics.totalStores * 10)
  );

  const growthPrediction = ((systemAnalytics.predictedSales - systemAnalytics.totalRevenue) / systemAnalytics.totalRevenue) * 100;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(systemAnalytics.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12.5% vs mês anterior</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-full -mr-8 -mt-8"></div>
        </Card>

        {/* Stores Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Lojas</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {systemAnalytics.totalStores}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {systemAnalytics.totalProducts} produtos em estoque
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -mr-8 -mt-8"></div>
        </Card>

        {/* Inventory Value Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor do Estoque</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(systemAnalytics.totalInventoryValue)}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Margem média: {formatPercentage(systemAnalytics.avgProfitMargin)}
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full -mr-8 -mt-8"></div>
        </Card>

        {/* Alerts Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticos</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${systemAnalytics.criticalAlerts > 0 ? 'text-red-600' : 'text-gray-400'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${systemAnalytics.criticalAlerts > 0 ? 'text-red-600' : 'text-gray-400'}`}>
              {systemAnalytics.criticalAlerts}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {systemAnalytics.criticalAlerts === 0 ? 'Sistema estável' : 'Requer atenção'}
            </div>
          </CardContent>
          <div className={`absolute top-0 right-0 w-16 h-16 ${systemAnalytics.criticalAlerts > 0 ? 'bg-red-100' : 'bg-gray-100'} rounded-full -mr-8 -mt-8`}></div>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Score */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Score de Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Eficiência Geral</span>
                <span className="font-medium">{efficiencyScore.toFixed(0)}/100</span>
              </div>
              <Progress value={efficiencyScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Margem de Lucro Média</span>
                <span className="font-medium">{formatPercentage(systemAnalytics.avgProfitMargin)}</span>
              </div>
              <Progress value={systemAnalytics.avgProfitMargin} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status do Sistema</span>
                <Badge variant={efficiencyScore > 80 ? 'default' : efficiencyScore > 60 ? 'secondary' : 'destructive'}>
                  {efficiencyScore > 80 ? 'Excelente' : efficiencyScore > 60 ? 'Bom' : 'Necessita Melhoria'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Prediction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Previsão de Crescimento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {formatPercentage(growthPrediction)}
              </div>
              <p className="text-sm text-muted-foreground">
                Crescimento previsto para o próximo mês
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Receita Atual</span>
                <span className="font-medium">{formatCurrency(systemAnalytics.totalRevenue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Receita Prevista</span>
                <span className="font-medium text-green-600">{formatCurrency(systemAnalytics.predictedSales)}</span>
              </div>
            </div>

            {systemAnalytics.topPerformingStore && (
              <div className="pt-4 border-t">
                <div className="text-sm">
                  <span className="text-muted-foreground">Loja Destaque: </span>
                  <span className="font-medium">{systemAnalytics.topPerformingStore.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(systemAnalytics.topPerformingStore.monthlySales)} em vendas
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligentDashboard;
