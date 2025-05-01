'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import ProfileDetails from '@/modules/profile/components/ProfileDetails';


const ProfilePage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p className="text-center p-4">Cargando perfil...</p>;
  }
  if (!session?.user) {
    return <p className="text-center p-4 text-red-500">No hay sesión activa.</p>;
  }

  return <ProfileDetails user={session.user} />;
};

export default ProfilePage;