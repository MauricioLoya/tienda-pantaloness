'use client';
import ModalGeneric from '@/lib/components/ModalGeneric';
import React from 'react';
import UserForm from './UserForm';
import { useRouter } from 'next/navigation';
import { createUserAction } from '../actions/createUserAction';
import { useToast } from '@/lib/components/ToastContext';

const CreateUser = () => {
  const router = useRouter();
  const { showToast } = useToast();
  return (
    <ModalGeneric
      title='Crear Usuario'
      triggerBtnTitle='Crear'
    >
      {(closeModal) => (
        <UserForm
          onSuccess={async (values) => {
            await createUserAction(values);
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