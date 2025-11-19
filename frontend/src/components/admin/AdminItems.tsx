'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, Pencil, Loader2 } from 'lucide-react';
import { toast } from "sonner";
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

// Interfaces para Tipagem
interface Category {
  id: string | number;
  description: string;
}

interface Item {
  id: string;
  description: string;
  unitPrice: number | string;
  categoryId: string | number;
  category?: Category;
}

export function AdminItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados do Formulário de Criação
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCatId, setNewCatId] = useState('');

  // Estados de Edição
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCatId, setEditCatId] = useState('');

  // Carregar dados (Itens e Categorias)
  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao carregar dados."); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!newName || !newPrice || !newCatId) {
        toast.warning("Preencha todos os campos!");
        return;
    }

    try {
      await api.post('/items', {
        description: newName,
        unitPrice: parseFloat(newPrice), // Converter string para numero
        categoryId: newCatId 
      });
      
      // Limpar formulário
      setNewName(''); setNewPrice(''); setNewCatId('');
      
      toast.success("Produto criado com sucesso!");
      fetchData(); // Recarregar lista
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao criar produto."); 
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/items/${editId}`, {
        description: editName,
        unitPrice: parseFloat(editPrice),
        categoryId: editCatId
      });
      setIsEditOpen(false);
      toast.success("Produto atualizado!");
      fetchData();
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao atualizar produto."); 
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/items/${id}`);
      toast.success("Produto removido.");
      fetchData();
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao deletar. Verifique se o produto está em algum pedido."); 
    }
  };

  const openEditModal = (item: Item) => {
    setEditId(item.id);
    setEditName(item.description);
    setEditPrice(item.unitPrice.toString());
    // Converter ID da categoria para string para o Select funcionar
    setEditCatId(item.categoryId ? item.categoryId.toString() : '');
    setIsEditOpen(true);
  };

  if (loading) return <div className="text-white flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando produtos...</div>;

  return (
    <div className="space-y-6 text-white">
      
      {/* --- FORMULÁRIO DE CRIAÇÃO --- */}
      <div className="flex flex-col md:flex-row gap-4 items-end p-4 bg-[#1A1826] rounded-lg border border-[#332A3B]">
        <div className="space-y-2 flex-1 w-full">
          <span className="text-sm font-medium text-gray-300">Nome do Produto</span>
          <Input 
            className="bg-[#211E2C] border-[#332A3B] text-white placeholder:text-gray-500 mt-3" 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
            placeholder="Ex: X-Tudo" 
          />
        </div>
        <div className="space-y-2 w-full md:w-32">
          <span className="text-sm font-medium text-gray-300">Preço</span>
          <Input 
            className="bg-[#211E2C] border-[#332A3B] text-white placeholder:text-gray-500 mt-3" 
            type="number" 
            value={newPrice} 
            onChange={e => setNewPrice(e.target.value)} 
            placeholder="0.00" 
          />
        </div>
        <div className="space-y-2 w-full md:w-48">
          <span className="text-sm font-medium text-gray-300">Categoria</span>
          <Select value={newCatId} onValueChange={setNewCatId}>
            <SelectTrigger className="bg-[#211E2C] border-[#332A3B] text-white mt-3">
                <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent className="bg-[#211E2C] border-[#332A3B] text-white">
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id.toString()}>{c.description}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreate} className="bg-[#FF8562] hover:bg-[#e07b5c] text-white">
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      {/* --- TABELA DE LISTAGEM --- */}
      <div className="rounded-md border border-[#332A3B] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#211E2C]">
            <TableRow className="border-[#332A3B] hover:bg-[#211E2C]">
              <TableHead className="text-gray-300">Nome</TableHead>
              <TableHead className="text-gray-300">Preço</TableHead>
              <TableHead className="text-gray-300">Categoria</TableHead>
              <TableHead className="text-right text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id} className="border-[#332A3B] hover:bg-[#211E2C]/50">
                <TableCell className="text-gray-200 font-medium">{item.description}</TableCell>
                <TableCell className="text-gray-200">R$ {Number(item.unitPrice).toFixed(2)}</TableCell>
                <TableCell className="text-gray-400">{item.category?.description || '-'}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(item)} className="hover:bg-[#332A3B] text-blue-400">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-[#332A3B] text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1A1826] border-[#332A3B] text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Produto?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Tem certeza que deseja excluir <strong>{item.description}</strong>?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-[#332A3B] text-white hover:bg-[#332A3B]">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700 border-none text-white">Sim, excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
                <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                        Nenhum produto cadastrado.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- MODAL DE EDIÇÃO --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#1A1826] border-[#332A3B] text-white">
            <DialogHeader><DialogTitle>Editar Produto</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-300">Nome</span>
                    <Input className="bg-[#211E2C] border-[#332A3B] text-white" value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-300">Preço</span>
                    <Input className="bg-[#211E2C] border-[#332A3B] text-white" type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-300">Categoria</span>
                    <Select value={editCatId} onValueChange={setEditCatId}>
                        <SelectTrigger className="bg-[#211E2C] border-[#332A3B] text-white"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-[#211E2C] border-[#332A3B] text-white">
                            {categories.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.description}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full bg-[#FF8562] hover:bg-[#e07b5c] text-white" onClick={handleUpdate}>
                    Salvar Alterações
                </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}