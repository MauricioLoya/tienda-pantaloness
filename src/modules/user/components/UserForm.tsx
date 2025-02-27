'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { deleteUserAction } from '../actions/deleteUserAction'
import { createUserAction } from '../actions/createUserAction'
import { updateUserAction } from '../actions/updateUserAction'

export interface UserFormProps {
  id?: number | string
  initialData?: {
    email?: string
    name?: string
    password?: string
    superAdmin?: boolean
  }
  mode?: 'create' | 'update' | 'detail'
}

const UserForm: React.FC<UserFormProps> = ({
  id,
  initialData = {},
  mode = 'create'
}) => {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()
  const initialValues = {
    email: initialData.email || '',
    name: initialData.name || '',
    password: initialData.password || '',
    superAdmin: initialData.superAdmin || false
  }

  const UserSchema = Yup.object().shape({
    email: Yup.string().email('Email inválido').required('El email es requerido'),
    name: Yup.string().required('El nombre es requerido'),
    password: mode === 'create'
      ? Yup.string().required('La contraseña es requerida')
      : Yup.string(),
    superAdmin: Yup.boolean()
  })

  const handleSubmit = async (values: any, { setSubmitting, setStatus }: any) => {
    try {
      if (mode === 'create') {
        await createUserAction(values)
      } else if (mode === 'update') {
        if (!id) throw new Error('ID no proporcionado')
        await updateUserAction(Number(id), values)
      }
      router.push('/admin/users')
    } catch (error: any) {
      setStatus(error.message || 'Error al procesar la solicitud')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        if (!id) throw new Error('ID no proporcionado')
        startTransition(async () => {
          await deleteUserAction(Number(id))
          router.push('/admin/users')
        })
      } catch (error: any) {
        alert(error.message || 'Error al eliminar el usuario')
      }
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <Formik
        initialValues={initialValues}
        validationSchema={UserSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            {status && (
              <div className="mb-4 text-red-500">
                {status}
              </div>
            )}
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
                name="superAdmin"
                type="checkbox"
                disabled={mode === 'detail'}
                className="mr-2"
              />
              <label className="text-gray-700">Super Admin</label>
            </div>
            {mode !== 'detail' && (
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  {mode === 'create' ? 'Crear usuario' : 'Actualizar usuario'}
                </button>
                {mode === 'update' && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Eliminar usuario
                  </button>
                )}
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default UserForm
