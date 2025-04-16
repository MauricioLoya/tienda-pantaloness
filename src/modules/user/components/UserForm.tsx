'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserInput } from '../definitions';


type UserFormProps = {
  initialData?: Partial<UserInput>;
  onSuccess: (values: UserInput) => void;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = {
    email: '',
    name: '',
    password: '',
    superAdmin: false
  },
  onSuccess,
}) => {

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    superAdmin: Yup.boolean(),
  });

  return (
    <Formik
      initialValues={initialData as UserInput}
      validationSchema={validationSchema}
      onSubmit={values => {
        onSuccess(values);
      }}
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

          <div className='flex justify-end'>
            <button
              type='submit'
              className='btn btn-primary'
            >
              Guardar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
