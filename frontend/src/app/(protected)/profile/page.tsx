'use client';

import { ProfileForm } from '@/components/profile/ProfileForm';
import { DeleteAccountSection } from '@/components/profile/DeleteAccountSection';

export default function ProfilePage() {
  return (
    <div>
      <div className='mb-8'>
        <h1 className="text-4xl font-bold text-white">Meu Perfil</h1>
        <p className="text-[#889898] mt-2">
          Gerencie suas informações e configurações.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <ProfileForm />
        </section>

        <div className="my-8 border-t border-dashed border-[#2D303E]" />

        <section>
          <DeleteAccountSection />
        </section>
      </div>
    </div>
  );
}