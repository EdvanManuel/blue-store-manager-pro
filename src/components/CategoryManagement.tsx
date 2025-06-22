
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit2, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  productCount: number;
}

interface CategoryManagementProps {
  categories: Category[];
  onCategoryAdded: (category: Category) => void;
  onCategoryUpdated: (category: Category) => void;
  onCategoryRemoved: (categoryId: number) => void;
}

const CategoryManagement = ({
  categories,
  onCategoryAdded,
  onCategoryUpdated,
  onCategoryRemoved
}: CategoryManagementProps) => {
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#3B82F6', icon: '📦' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const predefinedIcons = ['📦', '👕', '💻', '🏠', '🍔', '⚕️', '🚗', '📚', '🎵', '🏋️'];
  const predefinedColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) {
      toast.error("Nome da categoria é obrigatório");
      return;
    }

    const category: Category = {
      id: Date.now(),
      name: newCategory.name,
      description: newCategory.description,
      color: newCategory.color,
      icon: newCategory.icon,
      productCount: 0
    };

    onCategoryAdded(category);
    setNewCategory({ name: '', description: '', color: '#3B82F6', icon: '📦' });
    toast.success("Categoria adicionada com sucesso!");
  };

  const handleEditCategory = (category: Category) => {
    setIsEditing(category.id);
    setEditingCategory({ ...category });
  };

  const handleUpdateCategory = () => {
    if (!editingCategory) return;

    onCategoryUpdated(editingCategory);
    setIsEditing(null);
    setEditingCategory(null);
    toast.success("Categoria atualizada com sucesso!");
  };

  const handleRemoveCategory = (categoryId: number, categoryName: string) => {
    if (window.confirm(`Tem certeza que deseja remover a categoria "${categoryName}"?`)) {
      onCategoryRemoved(categoryId);
      toast.success("Categoria removida com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Gestão de Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <Input
              placeholder="Nome da categoria"
              value={newCategory.name}
              onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              placeholder="Descrição"
              value={newCategory.description}
              onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
            />
            <div className="flex gap-2">
              <select
                value={newCategory.icon}
                onChange={(e) => setNewCategory(prev => ({ ...prev, icon: e.target.value }))}
                className="px-3 py-2 border rounded-md"
              >
                {predefinedIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory(prev => ({ ...prev, color: e.target.value }))}
                className="w-12 h-10 border rounded-md"
              />
            </div>
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id} className="relative">
                <CardContent className="p-4">
                  {isEditing === category.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editingCategory?.name || ''}
                        onChange={(e) => setEditingCategory(prev => prev ? { ...prev, name: e.target.value } : null)}
                        placeholder="Nome"
                      />
                      <Input
                        value={editingCategory?.description || ''}
                        onChange={(e) => setEditingCategory(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Descrição"
                      />
                      <div className="flex gap-2">
                        <select
                          value={editingCategory?.icon || ''}
                          onChange={(e) => setEditingCategory(prev => prev ? { ...prev, icon: e.target.value } : null)}
                          className="px-2 py-1 border rounded text-sm"
                        >
                          {predefinedIcons.map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <input
                          type="color"
                          value={editingCategory?.color || '#3B82F6'}
                          onChange={(e) => setEditingCategory(prev => prev ? { ...prev, color: e.target.value } : null)}
                          className="w-8 h-8 border rounded"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateCategory}>Salvar</Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h3 className="font-semibold" style={{ color: category.color }}>{category.name}</h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditCategory(category)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleRemoveCategory(category.id, category.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {category.productCount} produtos
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManagement;
