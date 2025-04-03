'use client';
import React, { useState, Suspense } from 'react';
import { User } from '@prisma/client';
import { FaCopy } from 'react-icons/fa';
import DisplayInfo from '@/lib/components/DisplayInfo';
import GoBack from '@/lib/components/GoBack';
import { UserItem } from '../definitions';

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
              <div>
                <span>{user.email}</span>
                <button
                  onClick={() => copyToClipboard(user.email)}
                  className={`ml-2 text-grey-500 hover:underline ${copied ? 'text-green-500' : ''}`}
                >
                  {copied ? 'Copiado!' : <FaCopy />}
                </button>
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
