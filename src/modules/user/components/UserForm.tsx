'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

export interface UserFormInput {
  email: string;
  name: string;
  superAdmin: boolean;
}

type UserFormProps = {
  initialData?: Partial<UserFormInput>;
  onSuccess: (values: UserFormInput) => void;
  onClose: () => void;
  isEdit?: boolean;
  onPasswordReset?: (userId: number) => void;
  userId?: number;
}

const UserForm: React.FC<UserFormProps> = ({
  initialData = {
    email: '',
    name: '',
    superAdmin: false
  },
  onSuccess,
  onClose,
  isEdit = false,
  onPasswordReset,
  userId
}) => {
  // Schema simplificado - sin campos de contraseña
  const userSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    superAdmin: Yup.boolean(),
  });

  // Aseguramos que initialData tiene todos los campos requeridos
  const formInitialValues: UserFormInput = {
    email: initialData.email || '',
    name: initialData.name || '',
    superAdmin: initialData.superAdmin || false
  };

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={userSchema}
      onSubmit={(values) => {
        onSuccess(values);
        onClose();
      }}
    >
      {({ errors, touched }) => (
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

          {isEdit && onPasswordReset && userId && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => onPasswordReset(userId)}
                className="btn btn-sm btn-outline"
              >
                Gestionar contraseña
              </button>
            </div>
          )}

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
              Guardar
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;