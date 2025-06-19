
import { Link } from "react-router-dom";
import { Phone, ArrowRight, Trash2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Store } from "@/data/storeData";
import { toast } from "sonner";

interface StoreCardProps {
  store: Store;
  onRemove: (storeId: number, storeName: string) => void;
}

const StoreCard = ({ store, onRemove }: StoreCardProps) => {
  const handleCallStore = (phone: string, storeName: string) => {
    window.location.href = `tel:${phone}`;
    toast.success(`Ligando para ${storeName}...`, {
      description: phone,
    });
  };

  return (
    <Card className="card-hover border border-blue-light/30 overflow-hidden group">
      <CardHeader className="blue-gradient-bg text-white relative">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{store.name}</CardTitle>
            <CardDescription className="text-white/80">
              {store.address}
            </CardDescription>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja excluir a loja "{store.name}"? 
                  Todos os produtos desta loja também serão removidos. 
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onRemove(store.id, store.name)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Faturamento Mensal:</span>
            <span className="font-semibold text-green-600">
              {store.monthlySales.toLocaleString('pt-BR')} Kz
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estoque Crítico:</span>
            <span className={`font-semibold ${store.criticalStock > 5 ? 'text-red-600' : 'text-amber-600'}`}>
              {store.criticalStock} {store.criticalStock === 1 ? 'item' : 'itens'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Produtos a Expirar:</span>
            <span className={`font-semibold ${store.expiringProducts > 5 ? 'text-red-600' : 'text-amber-600'}`}>
              {store.expiringProducts} {store.expiringProducts === 1 ? 'produto' : 'produtos'}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 bg-gradient-to-r from-gray-50 to-blue-50">
        <Button 
          variant="outline" 
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => handleCallStore(store.phone, store.name)}
        >
          <Phone className="h-4 w-4 mr-2" /> Ligar
        </Button>
        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Link to={`/store/${store.id}`}>
            Acessar <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StoreCard;
