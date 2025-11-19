'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ShoppingCart, Loader2, Search, FilterX, ArrowUpDown} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Tipagem ajustada para o retorno real do Prisma
interface Category {
  id: string;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: string; 
  categoryId: string;
  category: Category;
}

const ITEMS_PER_PAGE = 6;

export function ItemList() {
  // --- Estados de Dados ---
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- Estados de Controle ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortOption, setSortOption] = useState('DEFAULT');
  const [currentPage, setCurrentPage] = useState(1);

  const { addItem } = useCartStore();

  // 1. Busca os dados
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data);
      } catch (err) {
        setError('Erro ao carregar o cardápio. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // 2. Extrai categorias únicas
  const categories = useMemo(() => {
    const uniqueCategories = new Set(items.map(item => item.category.description));
    return Array.from(uniqueCategories);
  }, [items]);

  // 3. Lógica de Filtragem
  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category.description === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // 2. Ordenação (NOVO)
  const sortedItems = useMemo(() => {
    // Criamos uma cópia para não mutar o array original
    return [...filteredItems].sort((a, b) => {
      switch (sortOption) {
        case 'PRICE_ASC':
          return parseFloat(a.unitPrice) - parseFloat(b.unitPrice);
        case 'PRICE_DESC':
          return parseFloat(b.unitPrice) - parseFloat(a.unitPrice);
        case 'NAME_ASC':
          return a.description.localeCompare(b.description);
        case 'NAME_DESC':
          return b.description.localeCompare(a.description);
        default:
          return 0; // Ordem original (por ID ou criação)
      }
    });
  }, [filteredItems, sortOption]);

  // 4. Lógica de Paginação
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Resetar para pagina 1 quando filtrar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  // Resetar tudo (Botão Limpar)
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortOption('DEFAULT');
  };

  // Função auxiliar para mudar de página
  const handlePageChange = (page: number, e?: React.MouseEvent) => {
    e?.preventDefault(); // Evita comportamento de link se houver href
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // --- Renderização ---

  if (loading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        <p>Carregando as delícias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      {/* --- Barra de Ferramentas --- */}
<div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="O que você procura hoje?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200"
          />
        </div>
        
        <div className="flex flex-row gap-3 overflow-x-auto pb-1 md:pb-0">
          
          {/* Filtro de Categoria */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[190px] bg-gray-50 border-gray-200 focus:bg-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas as Categorias</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro de Ordenação */}
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200 focus:bg-white">
              <ArrowUpDown className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEFAULT">Padrão</SelectItem>
              <SelectItem value="PRICE_ASC">Menor Preço</SelectItem>
              <SelectItem value="PRICE_DESC">Maior Preço</SelectItem>
              <SelectItem value="NAME_ASC">Nome (A-Z)</SelectItem>
              <SelectItem value="NAME_DESC">Nome (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || selectedCategory !== 'ALL' || sortOption !== 'DEFAULT') && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleClearFilters}
              className="text-gray-400 hover:text-red-600 hover:bg-red-50 shrink-0"
              title="Limpar Filtros"
            >
              <FilterX className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* --- Grid de Produtos --- */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
          <p>Nenhum produto encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <Card key={item.id} className="flex flex-col justify-between transition-all hover:shadow-md hover:border-red-200 group">
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="line-clamp-1" title={item.description}>
                    {item.description}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {item.category.description}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  Delicioso item da categoria {item.category.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  R$ {parseFloat(item.unitPrice).toFixed(2).replace('.', ',')}
                </p>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 transition-all active:scale-95" 
                  onClick={() => addItem({ ...item, unitPrice: parseFloat(item.unitPrice) })}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> 
                  Adicionar
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- Paginação Shadcn --- */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => handlePageChange(currentPage - 1, e)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>

            {/* Números das Páginas */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={page === currentPage}
                  onClick={(e) => handlePageChange(page, e)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Botão Próxima */}
            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => handlePageChange(currentPage + 1, e)}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}