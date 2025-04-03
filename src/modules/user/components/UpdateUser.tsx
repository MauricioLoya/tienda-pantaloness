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
  const [updatedUser] = useState<UserItem>({
    id: user.id,
    email: user.email,
    name: user.name,
    superAdmin: user.superAdmin,
    isDeleted: user.isDeleted,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  });

  const handleValuesChange = (values: UserInput) => {
    updatedUser.email = values.email
    updatedUser.name = values.name
    updatedUser.superAdmin = values.superAdmin
  };

  const handleSubmit = async (close: () => void) => {
    try {
      await updateUserAction(updatedUser);
      router.refresh();
      showToast('Usuario actualizado correctamente', 'success');
      close();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast('Por favor, corrige los errores en el formulario.', 'error');
      } else {
        showToast('Error desconocido al guardar el usuario', 'error');
      }
    }
  };

  return (
    <ModalGeneric
      title="Actualizar Usuario"
      triggerBtnTitle="Actualizar"
      triggerBtnContent={<FaEdit />}
      actionBtnText="Actualizar Cambios"
      cancelBtnText="Cancelar"
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log('Cancelar')}
    >
      <UserForm
        initialData={updatedUser}
        onValuesChange={handleValuesChange}
      />
    </ModalGeneric>
  );
};

export default UpdateUser;
