
import { Brain } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AddStoreCardProps {
  onAddClick: () => void;
}

const AddStoreCard = ({ onAddClick }: AddStoreCardProps) => {
  return (
    <Card className="border border-dashed border-blue-400/50 flex flex-col items-center justify-center p-6 card-hover bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[320px] group">
      <div className="text-6xl text-blue-400 mb-4 group-hover:scale-110 transition-transform">+</div>
      <h3 className="text-lg font-medium text-blue-700 mb-2">Adicionar Nova Loja</h3>
      <p className="text-blue-600/70 text-center mb-4 text-sm">
        Expanda sua rede e maximize seus lucros
      </p>
      <Button 
        variant="outline" 
        className="border-blue-400 text-blue-700 hover:bg-blue-100"
        onClick={onAddClick}
      >
        <Brain className="h-4 w-4 mr-2" />
        Adicionar Loja
      </Button>
    </Card>
  );
};

export default AddStoreCard;
