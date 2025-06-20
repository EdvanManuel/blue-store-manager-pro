
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "@/data/storeData";

interface StoreStatisticsCardProps {
  store: Store;
}

const StoreStatisticsCard = ({ store }: StoreStatisticsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-light/10 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Faturamento Mensal</h3>
            <p className="text-2xl font-bold text-blue-dark">{store.monthlySales.toLocaleString('pt-BR')} Kz</p>
          </div>
          
          <div className={`${store.criticalStock > 5 ? 'bg-red-100' : 'bg-amber-50'} p-4 rounded-lg`}>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Produtos com Estoque Crítico</h3>
            <p className={`text-2xl font-bold ${store.criticalStock > 5 ? 'text-red-600' : 'text-amber-600'}`}>
              {store.criticalStock}
            </p>
          </div>
          
          <div className={`${store.expiringProducts > 5 ? 'bg-red-100' : 'bg-amber-50'} p-4 rounded-lg`}>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Produtos a Expirar</h3>
            <p className={`text-2xl font-bold ${store.expiringProducts > 5 ? 'text-red-600' : 'text-amber-600'}`}>
              {store.expiringProducts}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreStatisticsCard;
