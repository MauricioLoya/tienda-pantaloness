'use client';
import ModalGeneric from '@/lib/components/ModalGeneric';
import React, { useState } from 'react';
import UserForm from './UserForm';
import { useRouter } from 'next/navigation';
import { createUserAction } from '../actions/createUserAction';
import { UserInput } from '../definitions';

const CreateUser = () => {
  const router = useRouter();

  const [formState, setFormState] = useState<UserInput>({
    email: '',
    name: '',
    password: '',
    superAdmin: false,
  });

  const handleValuesChange = (values: UserInput) => {
    setFormState(values);
  };

  const handleSubmit = async (close: () => void) => {
    try {
      await createUserAction(formState);
      close();
      router.refresh();
    } catch (error) {
      alert('Por favor, corrige los errores en el formulario.');
      console.log(error);
    }
  };

  return (
    <ModalGeneric
      title='Crear Usuario'
      triggerBtnTitle='Crear'
      actionBtnText='Guardar'
      actionBtnFunction={handleSubmit}
      cancelBtnText='Cancelar'
      cancelBtnFunction={() => console.log('Cancelar')}
    >
      <UserForm initialData={formState} onValuesChange={handleValuesChange} />
    </ModalGeneric>
  );
};

export default CreateUser;