
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Download, RefreshCw } from "lucide-react";
import { useFinancialManagement } from "@/hooks/useFinancialManagement";
import { useGrowthForecasting } from "@/hooks/useGrowthForecasting";

const FinancialDashboard = () => {
  const { 
    globalFinancials, 
    storeFinancials, 
    monthlyComparison, 
    refreshFinancials, 
    exportFinancialReport 
  } = useFinancialManagement();
  
  const { 
    globalGrowthAnalysis, 
    storeGrowthAnalyses, 
    refreshGrowthAnalysis 
  } = useGrowthForecasting();

  const handleRefresh = () => {
    refreshFinancials();
    refreshGrowthAnalysis();
  };

  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('pt-BR')} Kz`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign className="h-8 w-8 text-green-600" />
          <h1 className="text-3xl font-bold text-green-700">Gestão Financeira</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          <Button onClick={exportFinancialReport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="stores">Por Loja</TabsTrigger>
          <TabsTrigger value="forecasting">Previsões</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {globalFinancials && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Receita Total</p>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(globalFinancials.totalRevenue)}
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
                        <p className="text-sm text-gray-600">Lucro Bruto</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {formatCurrency(globalFinancials.grossProfit)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Margem de Lucro</p>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPercentage(globalFinancials.profitMargin)}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Lucro Líquido</p>
                        <p className={`text-2xl font-bold ${globalFinancials.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(globalFinancials.netProfit)}
                        </p>
                      </div>
                      {globalFinancials.netProfit >= 0 ? 
                        <TrendingUp className="h-8 w-8 text-green-500" /> :
                        <TrendingDown className="h-8 w-8 text-red-500" />
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Detalhes Financeiros</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Custos Totais:</span>
                        <span className="font-semibold">{formatCurrency(globalFinancials.totalCosts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Despesas Operacionais:</span>
                        <span className="font-semibold">{formatCurrency(globalFinancials.operationalExpenses)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fluxo de Caixa:</span>
                        <span className={`font-semibold ${globalFinancials.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(globalFinancials.cashFlow)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Crescimento Mensal:</span>
                        <Badge variant={globalFinancials.monthlyGrowth >= 0 ? "default" : "destructive"}>
                          {formatPercentage(globalFinancials.monthlyGrowth)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {storeFinancials.map((storeFinancial) => (
              <Card key={storeFinancial.storeId}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{storeFinancial.storeName}</CardTitle>
                    <Badge variant={
                      storeFinancial.performance === 'excellent' ? 'default' :
                      storeFinancial.performance === 'good' ? 'secondary' :
                      storeFinancial.performance === 'average' ? 'outline' : 'destructive'
                    }>
                      {storeFinancial.performance === 'excellent' ? 'Excelente' :
                       storeFinancial.performance === 'good' ? 'Bom' :
                       storeFinancial.performance === 'average' ? 'Médio' : 'Fraco'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Receita:</span>
                      <span className="font-semibold">{formatCurrency(storeFinancial.metrics.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro Bruto:</span>
                      <span className="font-semibold">{formatCurrency(storeFinancial.metrics.grossProfit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Margem:</span>
                      <span className="font-semibold">{formatPercentage(storeFinancial.metrics.profitMargin)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lucro Líquido:</span>
                      <span className={`font-semibold ${storeFinancial.metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(storeFinancial.metrics.netProfit)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          {globalGrowthAnalysis && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Previsão de Crescimento Global</CardTitle>
                  <Badge variant={
                    globalGrowthAnalysis.trend === 'bullish' ? 'default' :
                    globalGrowthAnalysis.trend === 'bearish' ? 'destructive' : 'secondary'
                  }>
                    {globalGrowthAnalysis.trend === 'bullish' ? 'Alta' :
                     globalGrowthAnalysis.trend === 'bearish' ? 'Baixa' : 'Neutro'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Próximo Mês</p>
                    <p className="text-xl font-bold">{formatCurrency(globalGrowthAnalysis.nextMonth)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Próximo Trimestre</p>
                    <p className="text-xl font-bold">{formatCurrency(globalGrowthAnalysis.nextQuarter)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Próximo Ano</p>
                    <p className="text-xl font-bold">{formatCurrency(globalGrowthAnalysis.nextYear)}</p>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">Confiança da Previsão</p>
                  <p className="text-lg font-semibold">{formatPercentage(globalGrowthAnalysis.confidence)}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {storeGrowthAnalyses.map((analysis) => (
              <Card key={analysis.storeId}>
                <CardHeader>
                  <CardTitle className="text-lg">{analysis.storeName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Taxa de Crescimento:</span>
                      <Badge variant={analysis.growthRate >= 0 ? "default" : "destructive"}>
                        {formatPercentage(analysis.growthRate)}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Previsão Próximo Mês:</p>
                      <p className="text-lg font-bold">{formatCurrency(analysis.prediction.nextMonth)}</p>
                    </div>

                    {analysis.riskFactors.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-red-600 mb-1">Fatores de Risco:</p>
                        <ul className="text-xs text-red-600 space-y-1">
                          {analysis.riskFactors.map((risk, index) => (
                            <li key={index}>• {risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {analysis.opportunities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-green-600 mb-1">Oportunidades:</p>
                        <ul className="text-xs text-green-600 space-y-1">
                          {analysis.opportunities.map((opportunity, index) => (
                            <li key={index}>• {opportunity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {monthlyComparison && (
            <Card>
              <CardHeader>
                <CardTitle>Comparativo Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Mês Atual</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Receita:</span>
                        <span className="font-semibold">{formatCurrency(monthlyComparison.currentMonth.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lucro Bruto:</span>
                        <span className="font-semibold">{formatCurrency(monthlyComparison.currentMonth.grossProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margem:</span>
                        <span className="font-semibold">{formatPercentage(monthlyComparison.currentMonth.profitMargin)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Mês Anterior</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Receita:</span>
                        <span className="font-semibold">{formatCurrency(monthlyComparison.previousMonth.totalRevenue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lucro Bruto:</span>
                        <span className="font-semibold">{formatCurrency(monthlyComparison.previousMonth.grossProfit)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Margem:</span>
                        <span className="font-semibold">{formatPercentage(monthlyComparison.previousMonth.profitMargin)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {monthlyComparison.trendDirection === 'up' ? 
                      <TrendingUp className="h-5 w-5 text-green-500" /> :
                      monthlyComparison.trendDirection === 'down' ?
                      <TrendingDown className="h-5 w-5 text-red-500" /> :
                      <div className="h-5 w-5" />
                    }
                    <span className="text-lg font-bold">
                      Crescimento: {formatPercentage(monthlyComparison.growthPercentage)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;
