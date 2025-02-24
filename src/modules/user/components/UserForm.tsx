"use client"

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export interface UserFormProps {
  initialData?: {
    email?: string
    name?: string
    password?: string
    isDeleted?: boolean
    superAdmin?: boolean
  }
  onSubmit: (data: any) => Promise<void>
  mode?: 'create' | 'update' | 'detail'
  checkEmailUnique?: (email: string) => Promise<boolean>
}

const getUserValidationSchema = (
  mode: 'create' | 'update' | 'detail',
  checkEmailUnique: (email: string) => Promise<boolean>
) =>
  Yup.object().shape({
    email: Yup.string()
      .email('Email inválido')
      .required('El email es requerido')
      .test(
        'unique-email',
        'El email ya está en uso',
        async function (value) {
          if (mode === 'create' && value) {
            return await checkEmailUnique(value)
          }
          return true
        }
      ),
    name: Yup.string().required('El nombre es requerido'),
    password:
      mode === 'create'
        ? Yup.string().required('La contraseña es requerida')
        : Yup.string(),
    isDeleted: Yup.boolean(),
    superAdmin: Yup.boolean()
  })

const UserForm: React.FC<UserFormProps> = ({
  initialData = {},
  onSubmit,
  mode = 'create',
  checkEmailUnique = async () => true
}) => {
  const initialValues = {
    email: initialData.email || '',
    name: initialData.name || '',
    password: initialData.password || '',
    isDeleted: initialData.isDeleted || false,
    superAdmin: initialData.superAdmin || false
  }

  const validationSchema = getUserValidationSchema(mode, checkEmailUnique)

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            await onSubmit(values)
          } catch (error: any) {
            setStatus(error.message || 'Error al procesar la solicitud')
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            {status && <div className="mb-4 text-red-500">{status}</div>}
            <div className="mb-4">
              <label className="block text-gray-700">Email:</label>
              <Field
                name="email"
                type="email"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nombre:</label>
              <Field
                name="name"
                type="text"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>
            {mode === 'create' && (
              <div className="mb-4">
                <label className="block text-gray-700">Contraseña:</label>
                <Field
                  name="password"
                  type="password"
                  disabled={mode === 'detail'}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>
            )}
            <div className="mb-4 flex items-center">
            <Field
                name="isDeleted"
                type="checkbox"
                disabled={mode === 'detail'}
                className="mr-2"
              />
              <label className="text-gray-700">Eliminado</label>
            </div>
            <div className="mb-4 flex items-center">
              <Field
                name="superAdmin"
                type="checkbox"
                disabled={mode === 'detail'}
                className="mr-2"
              />
              <label className="text-gray-700">Super Admin</label>
            </div>

            {mode !== 'detail' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {mode === 'create' ? 'Crear usuario' : 'Actualizar usuario'}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default UserForm
