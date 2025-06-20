
import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Product, hasLowStock, isCloseToExpiry, daysUntilExpiry } from "@/data/storeData";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";

interface ProductsManagementProps {
  storeId: number;
  products: Product[];
  onProductAdded: (product: Product) => void;
  onProductUpdated: (product: Product) => void;
  onProductRemoved: (productId: number, productName: string) => void;
}

const ProductsManagement = ({ 
  storeId, 
  products, 
  onProductAdded, 
  onProductUpdated, 
  onProductRemoved 
}: ProductsManagementProps) => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const handleAddProduct = (newProduct: Product) => {
    onProductAdded(newProduct);
    setShowAddProduct(false);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    onProductUpdated(updatedProduct);
    setEditingProduct(null);
  };

  return (
    <>
      {showAddProduct && (
        <AddProductForm
          storeId={storeId}
          onProductAdded={handleAddProduct}
          onCancel={() => setShowAddProduct(false)}
        />
      )}

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onProductUpdated={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
        />
      )}
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Produtos da Loja ({products.length})</CardTitle>
            {!showAddProduct && !editingProduct && (
              <Button onClick={() => setShowAddProduct(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Produto
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-dark text-white">
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Código</th>
                  <th className="px-4 py-3 text-left">Categoria</th>
                  <th className="px-4 py-3 text-right">Preço de Custo</th>
                  <th className="px-4 py-3 text-right">Preço de Venda</th>
                  <th className="px-4 py-3 text-center">Estoque</th>
                  <th className="px-4 py-3 text-center">Validade</th>
                  <th className="px-4 py-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Nenhum produto encontrado. Clique em "Adicionar Produto" para começar.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr 
                      key={product.id} 
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.code}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3 text-right">{product.costPrice.toLocaleString('pt-BR')} Kz</td>
                      <td className="px-4 py-3 text-right">{product.sellingPrice.toLocaleString('pt-BR')} Kz</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          hasLowStock(product.quantity) 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          isCloseToExpiry(product.expiryDate) 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {formatDate(product.expiryDate)}
                          {isCloseToExpiry(product.expiryDate) && (
                            <span className="block text-xs mt-1">
                              Expira em {daysUntilExpiry(product.expiryDate)} dias
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="text-red-500">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o produto "{product.name}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onProductRemoved(product.id, product.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ProductsManagement;
