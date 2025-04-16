'use client';

import ModalGeneric from '@/lib/components/ModalGeneric';
import React, { useState } from 'react';
import UserForm from './UserForm';
import { useRouter } from 'next/navigation';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { UserInput, UserItem } from '../definitions';
import { updateUserAction } from '../actions/updateUserAction';

interface UpdateUserProps {
  user: UserItem;
}

const UpdateUser: React.FC<UpdateUserProps> = ({ user }) => {
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <ModalGeneric
      title="Actualizar Usuario"
      triggerBtnTitle="Actualizar"
    >
      <UserForm
        initialData={{
          email: user.email,
          name: user.name,
          superAdmin: user.superAdmin,
          password: user.password,
        }}
        onSuccess={async (values: UserInput) => {
          await updateUserAction({
            id: user.id,
            ...values,
            isDeleted: user.isDeleted,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
          showToast('Usuario actualizado correctamente', 'success');
          router.refresh();
        }}
      />
    </ModalGeneric>
  );
};

export default UpdateUser;
