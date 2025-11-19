'use client';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { DeleteAccountSection } from '@/components/profile/DeleteAccountSection';
//import { Separator } from '@/components/ui/separator'; // Se tiver shadcn separator, senão use <hr />

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-3xl py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e configurações da conta.
        </p>
      </div>

      {/* Formulário de Edição */}
      <section>
        <ProfileForm />
      </section>

      {/* Separador Visual */}
      <div className="my-8 border-t border-gray-200" />

      {/* Área de Perigo */}
      <section>
        <DeleteAccountSection />
      </section>
    </div>
  );
}