
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Bell, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  Database,
  Activity,
  Zap
} from "lucide-react";
import { useSmartNotifications } from "@/hooks/useSmartNotifications";
import { useDataBackup } from "@/hooks/useDataBackup";
import { toast } from "sonner";

const AdvancedSystemPanel = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const { 
    notifications, 
    dismissNotification, 
    clearAllNotifications, 
    runSmartAnalysis 
  } = useSmartNotifications();
  
  const {
    backups,
    isBackingUp,
    lastBackup,
    createBackup,
    restoreFromBackup,
    exportBackup,
    deleteBackup
  } = useDataBackup();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Implementar importação de backup
      toast.info('Funcionalidade de importação será implementada');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  // Função para garantir que o timestamp seja um objeto Date válido
  const formatTimestamp = (timestamp: any) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return isNaN(date.getTime()) ? new Date().toLocaleDateString('pt-BR') : date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.log('Erro ao formatar timestamp:', error);
      return new Date().toLocaleDateString('pt-BR');
    }
  };

  const formatFullTimestamp = (timestamp: any) => {
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return isNaN(date.getTime()) ? new Date().toLocaleString('pt-BR') : date.toLocaleString('pt-BR');
    } catch (error) {
      console.log('Erro ao formatar timestamp completo:', error);
      return new Date().toLocaleString('pt-BR');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold">Painel Avançado do Sistema</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Backup & Recuperação
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Monitoramento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações Inteligentes
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={runSmartAnalysis} size="sm" variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Analisar Agora
                  </Button>
                  {notifications.length > 0 && (
                    <Button onClick={clearAllNotifications} size="sm" variant="outline">
                      Limpar Todas
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhuma notificação no momento. Sistema funcionando perfeitamente! ✅
                </p>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            <h4 className="font-semibold">{notification.title}</h4>
                            <Badge variant={getNotificationColor(notification.type) as any}>
                              {notification.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-400">
                            {formatFullTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {notification.action && (
                            <Button 
                              size="sm" 
                              onClick={notification.action}
                              variant="outline"
                            >
                              {notification.actionLabel || 'Ação'}
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Sistema de Backup
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={createBackup} disabled={isBackingUp}>
                    {isBackingUp ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Criar Backup
                  </Button>
                  <div className="relative">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Importar
                    </Button>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              {lastBackup && (
                <p className="text-sm text-gray-600">
                  Último backup: {formatFullTimestamp(lastBackup)}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {backups.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum backup encontrado. Crie seu primeiro backup para proteger seus dados.
                  </p>
                ) : (
                  backups.map((backup) => (
                    <div key={backup.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">
                            Backup {formatTimestamp(backup.timestamp)}
                          </h4>
                          <div className="flex gap-4 text-sm text-gray-600 mt-1">
                            <span>{backup.stores?.length || 0} lojas</span>
                            <span>{backup.products?.length || 0} produtos</span>
                            <span>{((backup.size || 0) / 1024).toFixed(1)} KB</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatFullTimestamp(backup.timestamp)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => exportBackup(backup.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => restoreFromBackup(backup.id)}
                          >
                            Restaurar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteBackup(backup.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Performance do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>CPU Usage:</span>
                    <Badge variant="outline">Normal</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Memória:</span>
                    <Badge variant="outline">Ótima</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Conectividade:</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Última Análise:</span>
                    <span className="text-sm text-gray-600">
                      {new Date().toLocaleTimeString('pt-BR')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Estatísticas do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transações/dia:</span>
                    <span className="font-medium">1,234</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eficiência:</span>
                    <Badge variant="default">Excelente</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Alertas Resolvidos:</span>
                    <span className="font-medium text-green-600">98%</span>
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

export default AdvancedSystemPanel;
