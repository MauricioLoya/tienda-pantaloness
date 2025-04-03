'use client';

import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { UserInput } from '../definitions';


type UserFormProps = {
  initialData?: Partial<UserInput>;
  onValuesChange: (values: UserInput) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = {
    email: '',
    name: '',
    password: '',
    superAdmin: false
  },
  onValuesChange,
}) => {

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    superAdmin: Yup.boolean(),
  });


  const FormObserver: React.FC<{
    onChange: (values: UserInput) => void;
  }> = ({ onChange }) => {
    const { values } = useFormikContext<UserInput>();
    useEffect(() => {
      onChange(values);
    }, [values, onChange]);
    return null;
  };

  return (
    <Formik
      initialValues={initialData as UserInput}
      validationSchema={validationSchema}
      onSubmit={() => { }}
    >
      {() => (
        <Form>
          <div className='mb-4'>
            <label className='block text-gray-700'>Email:</label>
            <Field
              name='email'
              type='email'
              className='mt-1 block w-full border border-gray-300 rounded p-2'
            />
            <ErrorMessage name='email' component='div' className='text-red-500 text-sm' />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Nombre:</label>
            <Field
              name='name'
              type='text'
              className='mt-1 block w-full border border-gray-300 rounded p-2'
            />
            <ErrorMessage name='name' component='div' className='text-red-500 text-sm' />
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700'>Contraseña:</label>
            <Field
              name='password'
              type='password'
              className='mt-1 block w-full border border-gray-300 rounded p-2'
            />
            <ErrorMessage name='password' component='div' className='text-red-500 text-sm' />
          </div>
          <div className='mb-4 flex items-center'>
            <Field name='superAdmin' type='checkbox' className='mr-2' />
            <label className='text-gray-700'>Super Admin</label>
          </div>

          <FormObserver onChange={onValuesChange} />
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
