
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Database,
  Settings
} from 'lucide-react';
import { useSystemAnalysis } from '@/hooks/useSystemAnalysis';

const SystemAnalysisPanel = () => {
  const { 
    analysisReport, 
    isAnalyzing, 
    isSyncing, 
    runCompleteAnalysis, 
    syncSystemData 
  } = useSystemAnalysis();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getQualityScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isAnalyzing && !analysisReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Analisando Sistema...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
            <Progress value={undefined} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Verificando consistência dos dados e identificando problemas...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisReport) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Nenhuma análise disponível.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Análise Completa do Sistema</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runCompleteAnalysis} 
            disabled={isAnalyzing}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            Re-analisar
          </Button>
          <Button 
            onClick={syncSystemData} 
            disabled={isSyncing}
          >
            <Database className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Sincronizando...' : 'Sincronizar Dados'}
          </Button>
        </div>
      </div>

      {/* Score de Qualidade dos Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score de Qualidade dos Dados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">Score Atual</span>
              <span className={`text-3xl font-bold ${getQualityScoreColor(analysisReport.dataQualityScore)}`}>
                {analysisReport.dataQualityScore.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={analysisReport.dataQualityScore} 
              className="h-3"
            />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-red-600">{analysisReport.criticalIssues}</p>
                <p className="text-sm text-muted-foreground">Críticos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{analysisReport.totalInconsistencies}</p>
                <p className="text-sm text-muted-foreground">Total de Problemas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {analysisReport.inconsistencies.filter(i => i.autoFixable).length}
                </p>
                <p className="text-sm text-muted-foreground">Auto-corrigíveis</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Recomendações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisReport.recommendations.map((recommendation, index) => (
              <Alert key={index}>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{recommendation}</AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Inconsistências Detalhadas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Inconsistências Encontradas
            </div>
            <Badge variant="outline">
              {analysisReport.totalInconsistencies} problemas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analysisReport.inconsistencies.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sistema Consistente!</h3>
              <p className="text-muted-foreground">
                Nenhuma inconsistência foi encontrada nos dados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {analysisReport.inconsistencies.map((inconsistency, index) => (
                <div key={inconsistency.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(inconsistency.severity)}`}></div>
                      <Badge variant={getSeverityBadgeVariant(inconsistency.severity)}>
                        {inconsistency.severity.toUpperCase()}
                      </Badge>
                      {inconsistency.autoFixable && (
                        <Badge variant="outline" className="text-green-600">
                          Auto-corrigível
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">#{index + 1}</span>
                  </div>
                  
                  <h4 className="font-medium mb-1">{inconsistency.description}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{inconsistency.affectedEntity}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-red-600">Valor Atual:</span>
                      <p className="text-muted-foreground">{String(inconsistency.currentValue)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-green-600">Valor Sugerido:</span>
                      <p className="text-muted-foreground">{String(inconsistency.suggestedValue)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações da Última Sincronização */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Última análise: {analysisReport.lastSyncDate.toLocaleString('pt-BR')}
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Dados sincronizados
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemAnalysisPanel;
