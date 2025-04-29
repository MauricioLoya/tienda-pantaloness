'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { generateRandomPassword } from '@/lib/utils';

// Interfaz para la creación de usuarios
export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  superAdmin: boolean;
}

type CreateUserFormProps = {
  onSuccess: (values: CreateUserInput) => void;
  onClose: () => void;
}

const CreateUserForm: React.FC<CreateUserFormProps> = ({
  onSuccess,
  onClose
}) => {
  // Validación para usuario nuevo
  const createUserSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    password: Yup.string().required('La contraseña es requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
      .required('Confirma tu contraseña'),
    superAdmin: Yup.boolean(),
  });

  const handleGeneratePassword = (setFieldValue: FormikHelpers<CreateUserInput>['setFieldValue']) => {
    const generatedPassword = generateRandomPassword();
    setFieldValue('password', generatedPassword);
    setFieldValue('confirmPassword', generatedPassword);
  };

  const initialValues: CreateUserInput = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    superAdmin: false
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={createUserSchema}
      onSubmit={(values) => {
        onSuccess(values);
        onClose();
      }}
    >
      {({ errors, touched, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email:
            </label>
            <Field
              type="email"
              name="email"
              id="email"
              className={`input input-bordered w-full ${errors.email && touched.email ? 'input-error' : ''}`}
            />
            <ErrorMessage name="email" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Nombre:
            </label>
            <Field
              type="text"
              name="name"
              id="name"
              className={`input input-bordered w-full ${errors.name && touched.name ? 'input-error' : ''}`}
            />
            <ErrorMessage name="name" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Contraseña:
            </label>
            <Field
              type="password"
              name="password"
              id="password"
              className={`input input-bordered w-full ${errors.password && touched.password ? 'input-error' : ''}`}
            />
            <ErrorMessage name="password" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">
              Confirmar contraseña:
            </label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className={`input input-bordered w-full ${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`}
            />
            <ErrorMessage name="confirmPassword" component="div" className="text-error" />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => handleGeneratePassword(setFieldValue)}
              className="btn btn-sm btn-outline"
            >
              Generar contraseña
            </button>
          </div>

          <div className="mb-4 flex items-center">
            <Field
              type="checkbox"
              name="superAdmin"
              id="superAdmin"
              className="checkbox checkbox-primary"
            />
            <label htmlFor="superAdmin" className="ml-2 block text-sm text-gray-700">
              Super Admin
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Crear usuario
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CreateUserForm;