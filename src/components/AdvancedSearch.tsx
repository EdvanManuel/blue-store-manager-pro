
import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter, X, MapPin, Package, DollarSign } from 'lucide-react';
import { getAllStores, getAllProducts, Store, Product } from '@/data/storeData';

interface SearchFilters {
  query: string;
  type: 'all' | 'stores' | 'products';
  category: string;
  priceRange: 'all' | 'low' | 'medium' | 'high';
  stockStatus: 'all' | 'inStock' | 'lowStock' | 'outOfStock';
  location: string;
}

interface SearchResult {
  type: 'store' | 'product';
  item: Store | Product;
  relevance: number;
  highlights: string[];
}

const AdvancedSearch = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    type: 'all',
    category: 'all',
    priceRange: 'all',
    stockStatus: 'all',
    location: 'all'
  });
  
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const stores = getAllStores();
  const products = getAllProducts();

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const locations = useMemo(() => {
    const locs = new Set(stores.map(s => s.address.split(',')[1]?.trim()).filter(Boolean));
    return Array.from(locs).sort();
  }, [stores]);

  const searchItems = () => {
    if (!filters.query.trim() && filters.type === 'all' && filters.category === 'all') {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      const searchResults: SearchResult[] = [];
      const query = filters.query.toLowerCase();

      // Search stores
      if (filters.type === 'all' || filters.type === 'stores') {
        stores.forEach(store => {
          let relevance = 0;
          const highlights: string[] = [];

          // Name match
          if (store.name.toLowerCase().includes(query)) {
            relevance += query ? 50 : 0;
            highlights.push('nome');
          }

          // Address match
          if (store.address.toLowerCase().includes(query)) {
            relevance += query ? 30 : 0;
            highlights.push('endereço');
          }

          // Phone match
          if (store.phone.includes(query)) {
            relevance += query ? 40 : 0;
            highlights.push('telefone');
          }

          // Location filter
          if (filters.location !== 'all' && !store.address.includes(filters.location)) {
            relevance = 0;
          }

          // Always include stores if no specific filters and no query
          if (!query && filters.type === 'stores' && filters.location === 'all') {
            relevance = 10;
          }

          if (relevance > 0) {
            searchResults.push({
              type: 'store',
              item: store,
              relevance,
              highlights
            });
          }
        });
      }

      // Search products
      if (filters.type === 'all' || filters.type === 'products') {
        products.forEach(product => {
          let relevance = 0;
          const highlights: string[] = [];

          // Name match
          if (product.name.toLowerCase().includes(query)) {
            relevance += query ? 50 : 0;
            highlights.push('nome');
          }

          // Code match
          if (product.code.toLowerCase().includes(query)) {
            relevance += query ? 60 : 0;
            highlights.push('código');
          }

          // Category match
          if (product.category.toLowerCase().includes(query)) {
            relevance += query ? 30 : 0;
            highlights.push('categoria');
          }

          // Apply filters
          if (filters.category !== 'all' && product.category !== filters.category) {
            relevance = 0;
          }

          // Price range filter
          if (filters.priceRange !== 'all') {
            const price = product.sellingPrice;
            if (filters.priceRange === 'low' && price > 1000) relevance = 0;
            if (filters.priceRange === 'medium' && (price <= 1000 || price > 5000)) relevance = 0;
            if (filters.priceRange === 'high' && price <= 5000) relevance = 0;
          }

          // Stock status filter
          if (filters.stockStatus !== 'all') {
            if (filters.stockStatus === 'outOfStock' && product.quantity > 0) relevance = 0;
            if (filters.stockStatus === 'lowStock' && product.quantity >= 5) relevance = 0;
            if (filters.stockStatus === 'inStock' && product.quantity < 5) relevance = 0;
          }

          // Location filter (via store)
          if (filters.location !== 'all') {
            const store = stores.find(s => s.id === product.storeId);
            if (!store || !store.address.includes(filters.location)) {
              relevance = 0;
            }
          }

          // Always include products if no specific filters and no query
          if (!query && filters.type === 'products' && filters.category === 'all' && filters.priceRange === 'all' && filters.stockStatus === 'all') {
            relevance = 10;
          }

          if (relevance > 0) {
            searchResults.push({
              type: 'product',
              item: product,
              relevance,
              highlights
            });
          }
        });
      }

      // Sort by relevance
      searchResults.sort((a, b) => b.relevance - a.relevance);
      setResults(searchResults.slice(0, 50)); // Limit to 50 results
      setIsSearching(false);
    }, 300);
  };

  useEffect(() => {
    searchItems();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      category: 'all',
      priceRange: 'all',
      stockStatus: 'all',
      location: 'all'
    });
  };

  const getStoreInfo = (productStoreId: number) => {
    return stores.find(s => s.id === productStoreId);
  };

  const formatPrice = (price: number) => `${price.toLocaleString('pt-BR')} Kz`;

  const activeFiltersCount = Object.values(filters).filter(value => value !== 'all' && value !== '').length;

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar lojas, produtos, códigos..."
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipo</label>
                <Select value={filters.type} onValueChange={(value: any) => setFilters(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="stores">Lojas</SelectItem>
                    <SelectItem value="products">Produtos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Categoria</label>
                <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Faixa de Preço</label>
                <Select value={filters.priceRange} onValueChange={(value: any) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="low">Até 1.000 Kz</SelectItem>
                    <SelectItem value="medium">1.001 - 5.000 Kz</SelectItem>
                    <SelectItem value="high">Acima de 5.000 Kz</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Status do Estoque</label>
                <Select value={filters.stockStatus} onValueChange={(value: any) => setFilters(prev => ({ ...prev, stockStatus: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="inStock">Em Estoque</SelectItem>
                    <SelectItem value="lowStock">Estoque Baixo</SelectItem>
                    <SelectItem value="outOfStock">Sem Estoque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Localização</label>
                <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {isSearching ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-muted-foreground">Buscando...</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {results.length} {results.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </h3>
            </div>
            
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={`${result.type}-${result.item.id}-${index}`} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    {result.type === 'store' ? (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{(result.item as Store).name}</h4>
                            <Badge variant="outline">Loja</Badge>
                            {result.highlights.length > 0 && (
                              <div className="flex gap-1">
                                {result.highlights.map(highlight => (
                                  <Badge key={highlight} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {(result.item as Store).address}
                          </p>
                          <div className="flex gap-4 text-sm">
                            <span>📞 {(result.item as Store).phone}</span>
                            <span>💰 {formatPrice((result.item as Store).monthlySales)}/mês</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                          <Package className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{(result.item as Product).name}</h4>
                            <Badge variant="outline">Produto</Badge>
                            {result.highlights.length > 0 && (
                              <div className="flex gap-1">
                                {result.highlights.map(highlight => (
                                  <Badge key={highlight} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                            <span>Código: {(result.item as Product).code}</span>
                            <span>Categoria: {(result.item as Product).category}</span>
                            <span className={`${(result.item as Product).quantity < 5 ? 'text-red-600' : 'text-green-600'}`}>
                              Estoque: {(result.item as Product).quantity}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex gap-4 text-sm">
                              <span>💰 {formatPrice((result.item as Product).sellingPrice)}</span>
                              <span>🏪 {getStoreInfo((result.item as Product).storeId)?.name}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : filters.query || activeFiltersCount > 0 ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou usar termos diferentes
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Limpar filtros
            </Button>
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Busca Avançada</h3>
            <p className="text-muted-foreground">
              Digite algo para começar a buscar ou use os filtros para explorar
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;
