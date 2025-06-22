
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertTriangle, TrendingUp, Package, Calendar, X, Trash2 } from "lucide-react";
import { useAdvancedNotifications } from "@/hooks/useAdvancedNotifications";

const NotificationCenter = () => {
  const {
    notifications,
    dismissNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByPriority
  } = useAdvancedNotifications();

  const [activeFilter, setActiveFilter] = useState<string>("all");

  const getIcon = (category: string) => {
    switch (category) {
      case 'stock': return <Package className="h-4 w-4" />;
      case 'sales': return <TrendingUp className="h-4 w-4" />;
      case 'expiry': return <Calendar className="h-4 w-4" />;
      case 'trends': return <TrendingUp className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredNotifications = activeFilter === "all" ? 
    notifications : 
    getNotificationsByCategory(activeFilter);

  const highPriorityCount = getNotificationsByPriority('high').length;
  const mediumPriorityCount = getNotificationsByPriority('medium').length;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-blue-700">Central de Notificações</h1>
          {notifications.length > 0 && (
            <Badge variant="destructive">{notifications.length}</Badge>
          )}
        </div>
        {notifications.length > 0 && (
          <Button onClick={clearAllNotifications} variant="outline">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpar Todas
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alta Prioridade</p>
                <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Média Prioridade</p>
                <p className="text-2xl font-bold text-yellow-600">{mediumPriorityCount}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{notifications.length}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="stock">Estoque</TabsTrigger>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="expiry">Validade</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="products">Produtos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma notificação encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((notification) => (
                <Card key={notification.id} className={`${
                  notification.priority === 'high' ? 'border-red-200 bg-red-50' :
                  notification.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                  'border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getIcon(notification.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge variant={getVariant(notification.type)}>
                              {notification.type === 'critical' ? 'Crítico' :
                               notification.type === 'warning' ? 'Aviso' :
                               notification.type === 'success' ? 'Sucesso' : 'Info'}
                            </Badge>
                            <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                              {notification.priority === 'high' ? 'Alta' :
                               notification.priority === 'medium' ? 'Média' : 'Baixa'}
                            </Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {notification.timestamp.toLocaleString('pt-BR')}
                          </p>
                          {notification.action && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={notification.action}
                            >
                              {notification.actionLabel || 'Ação'}
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationCenter;
