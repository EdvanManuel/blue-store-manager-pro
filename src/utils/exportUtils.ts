
import { Store, Product } from "@/data/storeData";

export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header.toLowerCase().replace(/\s+/g, '')];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportStoresCSV = (stores: Store[]) => {
  const headers = ['Nome', 'Endereço', 'Telefone', 'Email', 'Faturamento Mensal', 'Estoque Crítico', 'Produtos a Expirar'];
  const data = stores.map(store => ({
    nome: store.name,
    endereco: store.address,
    telefone: store.phone,
    email: store.email,
    faturamentomensal: store.monthlySales,
    estoquecritico: store.criticalStock,
    produtosaexpirar: store.expiringProducts
  }));
  
  exportToCSV(data, 'lojas_inventario.csv', headers);
};

export const exportProductsCSV = (products: Product[]) => {
  const headers = ['Nome', 'Código', 'Categoria', 'Preço Custo', 'Preço Venda', 'Quantidade', 'Data Entrada', 'Data Validade'];
  const data = products.map(product => ({
    nome: product.name,
    codigo: product.code,
    categoria: product.category,
    precocusto: product.costPrice,
    precovenda: product.sellingPrice,
    quantidade: product.quantity,
    dataentrada: product.entryDate,
    datavalidade: product.expiryDate
  }));
  
  exportToCSV(data, 'produtos_inventario.csv', headers);
};

export const exportInventoryReport = (stores: Store[], products: Product[]) => {
  const report = {
    data_geracao: new Date().toLocaleString('pt-BR'),
    total_lojas: stores.length,
    total_produtos: products.length,
    valor_total_estoque: products.reduce((sum, p) => sum + (p.costPrice * p.quantity), 0),
    valor_potencial_vendas: products.reduce((sum, p) => sum + (p.sellingPrice * p.quantity), 0),
    produtos_estoque_critico: products.filter(p => p.quantity < 5).length,
    produtos_a_expirar: products.filter(p => {
      const today = new Date();
      const expiry = new Date(p.expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 30;
    }).length
  };

  const reportText = `RELATÓRIO DE INVENTÁRIO
=====================================
Data de Geração: ${report.data_geracao}
Total de Lojas: ${report.total_lojas}
Total de Produtos: ${report.total_produtos}
Valor Total do Estoque: ${report.valor_total_estoque.toLocaleString('pt-BR')} Kz
Valor Potencial de Vendas: ${report.valor_potencial_vendas.toLocaleString('pt-BR')} Kz
Produtos com Estoque Crítico: ${report.produtos_estoque_critico}
Produtos a Expirar (30 dias): ${report.produtos_a_expirar}

DETALHES POR LOJA:
${stores.map(store => `
- ${store.name}
  Endereço: ${store.address}
  Telefone: ${store.phone}
  Faturamento Mensal: ${store.monthlySales.toLocaleString('pt-BR')} Kz
  Produtos: ${products.filter(p => p.storeId === store.id).length}
`).join('')}
`;

  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'relatorio_inventario.txt');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
