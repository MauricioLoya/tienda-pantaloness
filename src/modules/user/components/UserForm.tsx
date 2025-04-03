'use client';
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';

export interface FormUserValues {
  email: string;
  name: string;
  password: string;
  superAdmin: boolean;
}

export interface UserFormProps {
  initialValues: FormUserValues;
  onValuesChange: (values: FormUserValues) => void;
}

export const UserSchema = Yup.object().shape({
  email: Yup.string().email('Email inválido').required('El email es requerido'),
  name: Yup.string().required('El nombre es requerido'),
  password: Yup.string().required('La contraseña es requerida'),
  superAdmin: Yup.boolean(),
});

const FormObserver: React.FC<{
  onChange: (values: FormUserValues) => void;
}> = ({ onChange }) => {
  const { values } = useFormikContext<FormUserValues>();
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return null;
};

export interface UserFormHandle {
  submit: () => Promise<FormUserValues>;
}

const UserForm = forwardRef<UserFormHandle, UserFormProps>(
  ({ initialValues, onValuesChange }, ref) => {
    return (
      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={UserSchema}
          onSubmit={values => {
            console.log('User form submitted with values:', values);
          }}
        >
          {({ submitForm, values, validateForm, setTouched }) => {
            useImperativeHandle(ref, () => ({
              submit: async () => {
                setTouched({
                  email: true,
                  name: true,
                  password: true,
                  superAdmin: true,
                });
                const errors = await validateForm();
                if (Object.keys(errors).length > 0) {
                  return Promise.reject(errors);
                }
                await submitForm();
                return values;
              },
            }));
            return (
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
            );
          }}
        </Formik>
      </div>
    );
  }
);

export default UserForm;
