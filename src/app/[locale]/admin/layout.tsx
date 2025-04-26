import React from 'react';
import { auth } from '../../auth';
import { redirect } from 'next/navigation';
import NavBar from '@/modules/admin-dashboard/layout/NavBar';
import { SettingsRepository } from '@/modules/settings/definitions';
import { AbilityProvider } from '@/lib/ability-context';

type Props = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<Props> = async ({ children }) => {
  const session = await auth();
  const isSuperAdmin = session?.user.superAdmin || false;
  const logoUrl = await new SettingsRepository().get('logoUrl');
  const storeName = await new SettingsRepository().get('storeName');
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  const ClientAbilityProvider = ({ isSuperAdmin, children }: { isSuperAdmin: boolean, children: React.ReactNode }) => {
    return <AbilityProvider isSuperAdmin={isSuperAdmin}>{children}</AbilityProvider>;
  };
  return (
    <main>
      <ClientAbilityProvider isSuperAdmin={isSuperAdmin}>
        <div className='flex h-screen flex-col md:flex-row md:overflow-hidden bg-white'>
          <div className='w-full flex-none md:w-64'>
            <NavBar logoUrl={logoUrl} storeName={storeName} />
          </div>
          <section className='flex-grow md:p-4 md:overflow-y-auto md:px-12'>{children}</section>
        </div>
      </ClientAbilityProvider>
    </main>
  );
};

export default AdminLayout;
