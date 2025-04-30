'use client';

import ModalGeneric from '@/lib/components/ModalGeneric';
import React from 'react';
import UserForm from './UserForm';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/components/ToastContext';
import { updateUserAction } from '../actions/updateUserAction';
import { UserItem } from '../definitions';
import { FaEdit } from 'react-icons/fa';

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
      triggerBtnContent={<FaEdit />}

    >

      {(closeModal) => (
        <UserForm
          initialData={{
            email: user.email,
            name: user.name,
            superAdmin: user.superAdmin,
          }}
          isEdit={true}
          onSuccess={async (values) => {
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
          onClose={closeModal}
        />
      )}
    </ModalGeneric>
  );
};

export default UpdateUser;
