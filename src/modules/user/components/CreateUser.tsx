'use client';
import ModalGeneric from '@/lib/components/ModalGeneric';
import React from 'react';
import UserForm from './UserForm';
import { useRouter } from 'next/navigation';
import { createUserAction } from '../actions/createUserAction';
import { useToast } from '@/lib/components/ToastContext';
import { UserInput } from '../definitions';

interface CreateUserProps {
  disabled?: boolean;
}

const CreateUser: React.FC<CreateUserProps> = ({ disabled = false }) => {
  const router = useRouter();
  const { showToast } = useToast();
  return (
    <ModalGeneric
      title='Crear Usuario'
      triggerBtnTitle='Crear'
      disabled={disabled}
    >
      {(closeModal) => (
        <UserForm
          onSuccess={async (values) => {
            await createUserAction(values as UserInput);
            showToast('Usuario agregado correctamente', 'success');
            router.refresh();
          }}
          onClose={closeModal}
        />
      )}

    </ModalGeneric>
  );
};

export default CreateUser;