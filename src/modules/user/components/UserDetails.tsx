'use client';
import React, { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import DisplayInfo from '@/lib/components/DisplayInfo';
import { UserItem } from '../definitions';
import CopyClipboard from '@/lib/components/CopyClipboard';

type Props = {
  user: UserItem;
};

const UserDetails: React.FC<Props> = ({ user }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className='p-2'>
      <DisplayInfo
        info={[
          { label: 'ID', value: user.id },
          {
            label: 'Email',
            value: (
              <div className="flex flex-row items-center gap-2">
                {user.email}
                <CopyClipboard
                  text={user.email}
                  label="Copiar email"
                  buttonSize="btn-xs"
                  buttonColor="btn-accent"
                />
              </div>
            ),
          },
          { label: 'Nombre', value: user.name },
          {
            label: 'Fecha de Creación',
            value: new Date(user.createdAt).toLocaleDateString(),
          },
          {
            label: 'Última Actualización',
            value: new Date(user.updatedAt).toLocaleDateString(),
          },
          { label: 'Super Admin', value: user.superAdmin ? 'Sí' : 'No' },
          { label: 'Eliminado', value: user.isDeleted ? 'Sí' : 'No' },
          user.isDeleted && user.deletedAt
            ? {
              label: 'Fecha de Eliminación',
              value: new Date(user.deletedAt).toLocaleDateString(),
            }
            : null,
        ].filter(item => item !== null)}
      />
    </div>
  );
};

export default UserDetails;
