
import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { stores } from "@/data/storeData";

const Dashboard = () => {
  const [storeList, setStoreList] = useState(stores);

  const handleCallStore = (phone: string, storeName: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Ligando para ${storeName}...`, {
      description: phone,
    });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left text-blue-dark">
        Visão Geral das Lojas
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {storeList.map((store) => (
          <Card key={store.id} className="card-hover border border-blue-light/30 overflow-hidden">
            <CardHeader className="blue-gradient-bg text-white">
              <CardTitle className="text-xl">{store.name}</CardTitle>
              <CardDescription className="text-white/80">
                {store.address}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Faturamento Mensal:</span>
                  <span className="font-semibold">{store.monthlySales.toLocaleString('pt-BR')} Kz</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Produtos com Estoque Crítico:</span>
                  <span className={`font-semibold ${store.criticalStock > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                    {store.criticalStock}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Produtos a Expirar:</span>
                  <span className={`font-semibold ${store.expiringProducts > 5 ? 'text-red-600' : 'text-amber-600'}`}>
                    {store.expiringProducts}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <Button 
                variant="outline" 
                className="text-blue-light hover:text-blue-dark hover:bg-blue-light/10"
                onClick={() => handleCallStore(store.phone, store.name)}
              >
                <Phone className="h-4 w-4 mr-2" /> Ligar
              </Button>
              <Button asChild>
                <Link to={`/store/${store.id}`}>
                  Acessar Loja <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {/* Add New Store Card */}
        <Card className="border border-dashed border-blue-light/50 flex flex-col items-center justify-center p-6 card-hover bg-blue-light/5 min-h-[300px]">
          <div className="text-5xl text-blue-light mb-4">+</div>
          <h3 className="text-lg font-medium text-blue-dark mb-2">Adicionar Nova Loja</h3>
          <p className="text-gray-500 text-center mb-4">Clique para adicionar uma nova loja ao sistema</p>
          <Button variant="outline" className="border-blue-light text-blue-dark">
            Adicionar Loja
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
