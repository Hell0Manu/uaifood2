'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Pencil, Save, X, Loader2 } from 'lucide-react';
import { toast } from "sonner"

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

interface Category {
  id: string;
  description: string;
}

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Estados de Edição
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');

  const fetchCats = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao carregar categorias."); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async () => {
    if (!newDesc.trim()) return;
    try {
      await api.post('/categories', { description: newDesc });
      setNewDesc('');
      toast.success("Categoria criada!");
      fetchCats();
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao criar categoria."); 
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Categoria removida.");
      fetchCats();
    } catch (error: any) { 
      console.error(error);
      // Se o backend retornar erro específico (ex: FK constraint), mostramos
      const msg = error.response?.data?.error || "Não foi possível excluir. Verifique se há produtos nesta categoria.";
      toast.error(msg);
    }
  };

  const startEditing = (cat: Category) => {
    setEditingId(cat.id);
    setEditDesc(cat.description);
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/categories/${id}`, { description: editDesc });
      setEditingId(null);
      toast.success("Categoria atualizada!");
      fetchCats();
    } catch (error) { 
      console.error(error);
      toast.error("Erro ao atualizar categoria."); 
    }
  };

  if (loading) {
    return <div className="p-4 text-white flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando...</div>
  }

  return (
    <div className="space-y-6 text-white">
      {/* Formulário de Criação */}
      <div className="flex gap-4 items-end p-4 rounded-lg border border-[#332A3B] bg-[#1A1826]">
        <div className="space-y-2 flex-1">
          <span className="text-sm font-medium text-gray-300 mb-2">Nova Categoria</span>
          <Input 
            value={newDesc} 
            onChange={e => setNewDesc(e.target.value)} 
            placeholder="Ex: Bebidas" 
            className="bg-[#211E2C] border-[#332A3B] text-white mt-3"
          />
        </div>
        <Button onClick={handleCreate} disabled={!newDesc} className="bg-[#FF8562] hover:bg-[#e07b5c] text-white">
          <Plus className="mr-2 h-4 w-4" /> Criar
        </Button>
      </div>

      {/* Tabela de Categorias */}
      <div className="rounded-md border border-[#332A3B] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#211E2C]">
            <TableRow className="border-[#332A3B] hover:bg-[#211E2C]">
              <TableHead className="text-gray-300">Descrição</TableHead>
              <TableHead className="text-right text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} className="border-[#332A3B] hover:bg-[#211E2C]/50">
                <TableCell className="font-medium text-gray-200">
                  {editingId === cat.id ? (
                    <div className="flex gap-2 items-center">
                      <Input 
                          value={editDesc} 
                          onChange={(e) => setEditDesc(e.target.value)} 
                          className="h-8 bg-[#1A1826] border-[#332A3B] text-white"
                      />
                      <Button size="icon" variant="ghost" onClick={() => handleUpdate(cat.id)} className="hover:bg-[#332A3B] text-green-500">
                          <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditingId(null)} className="hover:bg-[#332A3B] text-gray-500">
                          <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    cat.description
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {editingId !== cat.id && (
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(cat)} className="hover:bg-[#332A3B] text-blue-400">
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
                            <AlertDialogTitle>Excluir Categoria?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-400">
                                Tem certeza que deseja excluir <strong>{cat.description}</strong>? 
                                <br/>Se houver produtos vinculados, a exclusão pode falhar.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent border-[#332A3B] text-white hover:bg-[#332A3B]">Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={() => handleDelete(cat.id)}
                                className="bg-red-600 hover:bg-red-700 text-white border-none"
                            >
                                Sim, excluir
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && !loading && (
                 <TableRow>
                    <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                        Nenhuma categoria encontrada. Crie a primeira acima!
                    </TableCell>
                 </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}