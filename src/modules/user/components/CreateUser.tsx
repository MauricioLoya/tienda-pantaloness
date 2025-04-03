'use client';
import React, { useState, useRef } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import UserForm, { FormUserValues, UserSchema, UserFormHandle } from './UserForm';
import { useRouter } from 'next/navigation';
import { createUserAction } from '../actions/createUserAction';

const CreateUser: React.FC = () => {
  const router = useRouter();
  const formRef = useRef<UserFormHandle>(null);

  const initialValues: FormUserValues = {
    email: '',
    name: '',
    password: '',
    superAdmin: false,
  };

  const [formState, setFormState] = useState<FormUserValues>(initialValues);

  const handleValuesChange = (values: FormUserValues) => {
    setFormState(values);
  };

  const handleSubmit = async (close: () => void) => {
    if (formRef.current) {
      try {
        const validValues = await formRef.current.submit();
        await createUserAction(validValues);
        close();
        router.refresh();
      } catch (errors) {
        alert('Por favor, corrige los errores en el formulario.');
      }
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
      <UserForm ref={formRef} initialValues={initialValues} onValuesChange={handleValuesChange} />
    </ModalGeneric>
  );
};

export default CreateUser;
