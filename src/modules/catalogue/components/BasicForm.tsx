'use client'

import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { updateBasicAction } from '../actions/updateBasicAction'
import { ProductInput } from '../definitions'

interface BasicFormProps {
  productId: number
  initialData: {
    name: string
    description: string
    basePrice: number
    active: boolean
  }
}

const BasicForm: React.FC<BasicFormProps> = ({ productId, initialData }) => {
  const router = useRouter()

  const schema = Yup.object().shape({
    name: Yup.string().required('Nombre requerido'),
    description: Yup.string().required('Descripción requerida'),
    basePrice: Yup.number().min(0).required('Precio requerido'),
    active: Yup.boolean()
  })

  async function handleSubmit(values: ProductInput) {
    await updateBasicAction(productId, values)
    router.refresh()
  }

  return (
    <div className="card shadow p-4">
      <Formik
        initialValues={initialData}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-3">
            <div>
              <label>Nombre</label>
              <Field name="name" type="text" className="input input-bordered w-full" />
              <ErrorMessage name="name" component="div" className="text-error" />
            </div>
            <div>
              <label>Descripción</label>
              <Field name="description" as="textarea" className="textarea textarea-bordered w-full" />
              <ErrorMessage name="description" component="div" className="text-error" />
            </div>
            <div>
              <label>Precio Base</label>
              <Field name="basePrice" type="number" className="input input-bordered w-full" />
              <ErrorMessage name="basePrice" component="div" className="text-error" />
            </div>
            <div className="flex items-center gap-2">
              <label>Activo</label>
              <Field name="active" type="checkbox" className="toggle" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary mt-2">
              Guardar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default BasicForm
