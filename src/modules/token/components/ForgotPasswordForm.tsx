'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

type ForgotPasswordFormProps = {
  onClose: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onClose
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('El email es requerido'),
  });

  const handleSubmit = async (values: { email: string }) => {
    try {
      setIsSubmitting(true);

      // Realizar una solicitud al backend para restablecer la contraseña
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
        }),
      });

      // Procesar la respuesta
      if (response.ok) {
        setMessage({
          text: 'Si tu email está registrado, recibirás una nueva contraseña en breve.',
          type: 'success'
        });
        // Cerrar el formulario después de 3 segundos si la operación fue exitosa
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }
    } catch (error) {
      setMessage({
        text: error instanceof Error ? error.message : 'Ha ocurrido un error',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Restablecer contraseña</h2>

      {message && (
        <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {message.text}
        </div>
      )}

      <Formik
        initialValues={{ email: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                placeholder="Tu correo electrónico"
                className={`w-full px-3 py-2 border rounded-md ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
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
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordForm;