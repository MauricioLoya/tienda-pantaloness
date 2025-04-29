'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type PasswordResetFormProps = {
  token: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const PasswordResetForm: React.FC<PasswordResetFormProps> = ({
  token,
  onSuccess,
  onError
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .required('La contraseña es requerida'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
      .required('Confirma tu contraseña'),
  });

  const handleSubmit = async (values: { password: string; confirmPassword: string }) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      onSuccess();
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Ocurrió un error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ password: '', confirmPassword: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-4">Establece tu nueva contraseña</h2>
            <p className="text-gray-600 mb-6">
              Ingresa una nueva contraseña para tu cuenta.
            </p>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nueva contraseña
            </label>
            <Field
              type="password"
              name="password"
              id="password"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.password && touched.password ? 'border-red-500' : ''
                }`}
            />
            <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirmar contraseña
            </label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''
                }`}
            />
            <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? 'Procesando...' : 'Restablecer contraseña'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PasswordResetForm;