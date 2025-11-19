'use client';

import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { 
  Card, 
  CardContent, 
  CardFooter, 
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

// --- Implementação da Função ItemList (Lógica mantida) ---

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

  // 3. Lógica de Filtragem, Ordenação e Paginação (mantida)
  const filteredItems = items.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.category.description === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedItems = useMemo(() => {
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
          return 0;
      }
    });
  }, [filteredItems, sortOption]);

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSortOption('DEFAULT');
  };

  const handlePageChange = (page: number, e?: React.MouseEvent) => {
    e?.preventDefault();
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // --- Renderização ---

  if (loading) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 text-[#EA7C69]">
        <Loader2 className="h-10 w-10 animate-spin text-[#EA7C69]" />
        <p className="text-white">Carregando as delícias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-lg border border-red-800 bg-[#252836] p-8 text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      {/* --- Barra de Ferramentas (Busca) --- */}
      <div className="flex flex-col md:flex-row gap-4 p-2 bg-[#2D303E] rounded-xl shadow-xl border border-[#2D303E] mb-10">
        
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#889898]" />
          <Input 
            placeholder="O que você procura hoje?" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Inputs em tema escuro: BG escuro, texto branco
            className="pl-10 bg-[#2D303E] border-[#2D303E] text-white placeholder:text-[#889898] focus:bg-[#252836] transition-all duration-200"
          />
        </div>
       
      </div>

      {/* --- LISTA DE CHIPS DE CATEGORIA --- */}
      <div className="flex space-x-3 overflow-x-auto pb-2 -mt-2">
        
        {/* Chip "Todas as Categorias" */}
        <Badge
          key="ALL"
          onClick={() => handleCategoryChange('ALL')}
          className={`cursor-pointer transition-colors duration-200 shrink-0 text-sm py-1.5 px-3 
            ${selectedCategory === 'ALL' 
              ? 'bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold' // Cor de destaque
              : 'bg-[#2D303E] hover:bg-[#252836] text-[#889898]'}`} // Cor de fundo secundária
        >
          Todas as Categorias
        </Badge>

        {/* Chips das Categorias Dinâmicas */}
        {categories.map(cat => (
          <Badge
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`cursor-pointer transition-colors duration-200 shrink-0 text-sm py-1.5 px-3 
              ${selectedCategory === cat 
                ? 'bg-[#EA7C69] hover:bg-[#d96a5b] text-[#1F1D2B] font-bold' // Cor de destaque
                : 'bg-[#2D303E] hover:bg-[#252836] text-[#889898]'}`} // Cor de fundo secundária
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* --- TÍTULO E ORDENAÇÃO --- */}
      <div className="flex flex-row justify-between items-center px-2">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Escolha um prato</h3>
        </div>
         
        <div className="flex flex-row gap-3 overflow-x-auto pb-1 md:pb-0">
          
          {/* Filtro de Ordenação */}
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger 
              // Estilo de elemento de controle escuro
              className="w-[180px] bg-[#2D303E] border-none text-white focus:ring-1 focus:ring-[#EA7C69]"
            >
              <ArrowUpDown className="mr-2 h-4 w-4 text-[#EA7C69]" />
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            {/* Conteúdo do Select (pop-up) precisa de estilo escuro no globals.css para ser perfeito */}
            <SelectContent className="bg-[#252836] border-[#2D303E] text-white">
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
              // Ajustado para o esquema de cores escuras
              className="text-[#889898] hover:text-[#EA7C69] hover:bg-[#2D303E] shrink-0"
              title="Limpar Filtros"
            >
              <FilterX className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

     {/* --- Grid de Produtos --- */}
      {filteredItems.length === 0 ? (
        <div className="text-center p-8 bg-[#252836] rounded-xl text-[#889898] border border-dashed border-[#2D303E]">
          <p>Nenhum produto encontrado com esses filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedItems.map((item) => (
            <Card 
              key={item.id} 
              // Fundo do Card (1F1D2B)
              className="bg-[#1F1D2B] pt-0 border-none overflow-hidden flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02] shadow-2xl"
            >              
              {/* 1. ESPAÇO DA IMAGEM E CATEGORIA */}
              <div className="relative h-40 w-full bg-[#2D303E] flex items-center justify-center overflow-hidden">
                
                {/* Placeholder de Imagem */}
                <span className="text-[#889898] text-sm">[Imagem do Produto]</span> 

                {/* Badge de Categoria Flutuante */}
                 <Badge 
                    // Fundo escuro para a badge
                    className="absolute bottom-3 left-3 shrink-0 text-xs bg-[#252836] text-white px-3 py-1"
                 >
                    {item.category.description}
                  </Badge>
              </div>

              {/* 2. CONTEÚDO (Nome e Descrição) */}
              <CardContent className="p-4 pt-3 flex-grow">
                <h3 
                    className="text-lg font-semibold line-clamp-1 mb-1 text-white" 
                    title={item.description}
                >
                    {item.description}
                </h3>
                {/* Adicionado um texto de descrição secundário */}
                <p className="text-sm text-[#889898] line-clamp-2">
                  Uma descrição curta e atraente do item.
                </p>
              </CardContent>
              
              {/* 3. RODAPÉ (Preço e Botão Adicionar) */}
              <CardFooter className="flex justify-between items-center pt-0 px-4 pb-4">
                <p className="text-2xl font-extrabold text-[#EA7C69]">
                  R$ {parseFloat(item.unitPrice).toFixed(2).replace('.', ',')}
                </p>
                
                <Button 
                  // Botão de destaque com a cor Primária (EA7C69)
                  className="bg-[#EA7C69] hover:bg-[#d96a5b] transition-all active:scale-95 text-[#1F1D2B] shrink-0" 
                  onClick={() => addItem({ ...item, unitPrice: parseFloat(item.unitPrice) })}
                >
                  <ShoppingCart className="h-4 w-4" /> 
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* --- Paginação Shadcn --- */}
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent 
            // Paginação em destaque
            className="bg-[#252836] p-3 rounded-xl border border-[#2D303E]"
          >
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => handlePageChange(currentPage - 1, e)}
                className={currentPage === 1 ? 'pointer-events-none opacity-50 text-[#889898]' : 'cursor-pointer text-white hover:bg-[#2D303E]'}
              />
            </PaginationItem>

            {/* Números das Páginas */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink 
                  href="#" 
                  isActive={page === currentPage}
                  onClick={(e) => handlePageChange(page, e)}
                  // Cor de destaque na página ativa
                  className={page === currentPage ? 'bg-[#EA7C69] text-white hover:bg-[#d96a5b]' : 'text-white hover:bg-[#2D303E]'}
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
                className={currentPage === totalPages ? 'pointer-events-none opacity-50 text-[#889898]' : 'cursor-pointer text-white hover:bg-[#2D303E]'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}