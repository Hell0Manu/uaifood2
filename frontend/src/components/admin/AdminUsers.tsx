'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Pencil, Loader2, Plus, MapPin, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
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

// Interfaces (Tipagem)
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'CLIENT' | 'ADMIN';
  birthDate?: string;
}

interface Address {
  id: string;
  street: string;
  number: string;
  district: string;
  city: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserAddresses, setSelectedUserAddresses] = useState<Address[]>([]);
  
  // Estados de Edição
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    birthDate: '',
    userType: 'CLIENT'
  });

  // Carregar Usuários
  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // Requer ADMIN
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Deletar Usuário
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/user/${id}`);
      toast.success("Usuário removido.");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao deletar usuário.");
    }
  };

  // Buscar Endereços (Opcional)
  const fetchAddresses = async (userId: string) => {
    setSelectedUserAddresses([]);
    try {
      // Tenta buscar endereços. Se a rota não existir no backend, cairá no catch.
      const res = await api.get(`/address/${userId}`); 
      setSelectedUserAddresses(res.data);
    } catch (error) {
      console.log("Não foi possível carregar endereços (rota pode não existir para admin).");
      toast.warning("Não foi possível carregar os endereços deste usuário.");
    }
  };

  // Abrir Modal de Edição
  const openEditModal = (user: User) => {
    setEditingUser(user);
    
    // Formatar data para input date (YYYY-MM-DD)
    let formattedDate = '';
    if (user.birthDate) {
      const dateObj = new Date(user.birthDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }

    setEditFormData({
      name: user.name || '',
      phone: user.phone || '',
      birthDate: formattedDate,
      userType: user.userType
    });
    setIsEditOpen(true);
  };

  // Salvar Edição
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload: any = {
        name: editFormData.name,
        phone: editFormData.phone,
        userType: editFormData.userType,
      };
      if (editFormData.birthDate) payload.birthDate = editFormData.birthDate;

      await api.put(`/user/${editingUser.id}`, payload);
      
      toast.success("Usuário atualizado!");
      setIsEditOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar usuário.");
    }
  };

  if (loading) return <div className="text-white flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Carregando usuários...</div>;

  return (
    <div className="space-y-6 text-white">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-[#FF8562]">Lista de Usuários</h3>
        
        {/* Botão de Info que dispara o Toast */}
        <Button 
          onClick={() => toast.info("Para criar um novo usuário, utilize a página de Registro pública.", {
            description: "O painel admin serve apenas para gerenciamento."
          })} 
          variant="outline" 
          className="border-[#332A3B] text-gray-300 hover:bg-[#332A3B] hover:text-white gap-2"
        >
          <Info className="h-4 w-4" /> Info
        </Button>
      </div>

      <div className="rounded-md border border-[#332A3B] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#211E2C]">
            <TableRow className="border-[#332A3B] hover:bg-[#211E2C]">
              <TableHead className="text-gray-300">Nome</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Tipo</TableHead>
              <TableHead className="text-right text-gray-300">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id} className="border-[#332A3B] hover:bg-[#211E2C]/50">
                <TableCell className="font-medium text-gray-200">{u.name}</TableCell>
                <TableCell className="text-gray-400">{u.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    u.userType === 'ADMIN' ? 'bg-purple-900/50 text-purple-200 border border-purple-700' : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    {u.userType}
                  </span>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  {/* Botão Ver Endereços */}
                  <Dialog onOpenChange={(open) => open && fetchAddresses(u.id)}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-[#332A3B] text-gray-400" title="Ver Endereços">
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#1A1826] border-[#332A3B] text-white">
                      <DialogHeader><DialogTitle>Endereços de {u.name}</DialogTitle></DialogHeader>
                      <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
                        {selectedUserAddresses.length === 0 ? (
                          <p className="text-sm text-gray-500">Nenhum endereço encontrado.</p>
                        ) : (
                          selectedUserAddresses.map((addr) => (
                            <div key={addr.id} className="border border-[#332A3B] p-3 rounded bg-[#211E2C]">
                              <p className="font-bold">{addr.street}, {addr.number}</p>
                              <p className="text-sm text-gray-400">{addr.district} - {addr.city}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Botão Editar */}
                  <Button variant="ghost" size="icon" onClick={() => openEditModal(u)} className="hover:bg-[#332A3B] text-blue-400">
                    <Pencil className="h-4 w-4" />
                  </Button>

                  {/* Botão Excluir */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-[#332A3B] text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-[#1A1826] border-[#332A3B] text-white">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Usuário?</AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Tem certeza que deseja excluir <strong>{u.name}</strong>? <br/>
                          Esta ação apagará todo o histórico do usuário.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent border-[#332A3B] text-white hover:bg-[#332A3B]">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(u.id)} className="bg-red-600 hover:bg-red-700 border-none text-white">Sim, excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-[#1A1826] border-[#332A3B] text-white">
          <DialogHeader><DialogTitle>Editar Usuário</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input className="bg-[#211E2C] border-[#332A3B] text-white" value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input className="bg-[#211E2C] border-[#332A3B] text-white" value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Usuário</Label>
              <Select value={editFormData.userType} onValueChange={(val: any) => setEditFormData({...editFormData, userType: val})}>
                <SelectTrigger className="bg-[#211E2C] border-[#332A3B] text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-[#211E2C] border-[#332A3B] text-white">
                  <SelectItem value="CLIENT">Cliente</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#FF8562] hover:bg-[#e07b5c] text-white">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}