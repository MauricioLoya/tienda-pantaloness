"use client"

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

interface PromotionFormProps {
  initialData?: {
    code?: string
    name?: string
    description?: string
    discount?: number
    startDate?: string
    endDate?: string
    active?: boolean
  }
  onSubmit: (data: any) => Promise<void>
  mode?: 'create' | 'update' | 'detail'
}

const PromotionForm: React.FC<PromotionFormProps> = ({
  initialData = {},
  onSubmit,
  mode = 'create'
}) => {
  const initialValues = {
    code: initialData.code || '',
    name: initialData.name || '',
    description: initialData.description || '',
    discount: initialData.discount || 0,
    startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
    endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
    active: initialData.active || false
  }

  const PromotionSchema = Yup.object().shape({
    code: Yup.string()
      .required('El código es requerido')
      .matches(/^[a-zA-Z0-9]+$/, 'El código solo puede contener letras y números')
      .min(4, 'El código debe tener al menos 4 caracteres')
      .max(10, 'El código debe tener como máximo 10 caracteres'),
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    discount: Yup.number()
      .min(0, 'El descuento debe ser mayor o igual a 0')
      .required('El descuento es requerido'),
    startDate: Yup.date().required('La fecha de inicio es requerida'),
    endDate: Yup.date()
      .required('La fecha de fin es requerida')
      .min(Yup.ref('startDate'), 'La fecha de fin debe ser posterior a la fecha de inicio'),
    active: Yup.boolean()
  })

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <Formik
        initialValues={initialValues}
        validationSchema={PromotionSchema}
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
            {status && (
              <div className="mb-4 text-red-500">
                {status}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700">Código:</label>
              <Field
                name="code"
                type="text"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="code" component="div" className="text-red-500 text-sm" />
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
            <div className="mb-4">
              <label className="block text-gray-700">Descripción:</label>
              <Field
                name="description"
                as="textarea"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Descuento (%):</label>
              <Field
                name="discount"
                type="number"
                step="0.01"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="discount" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Fecha de inicio:</label>
              <Field
                name="startDate"
                type="date"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Fecha de fin:</label>
              <Field
                name="endDate"
                type="date"
                disabled={mode === 'detail'}
                className="mt-1 block w-full border border-gray-300 rounded p-2"
              />
              <ErrorMessage name="endDate" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4 flex items-center">
              <Field
                name="active"
                type="checkbox"
                disabled={mode === 'detail'}
                className="mr-2"
              />
              <label className="text-gray-700">Activo</label>
            </div>
            {mode !== 'detail' && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {mode === 'create' ? 'Crear promoción' : 'Actualizar promoción'}
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default PromotionForm
