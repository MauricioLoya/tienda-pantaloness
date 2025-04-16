'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { OrderStatusInput } from '../definitions';

const orderStatusOptions = [
  'Procesando',
  'Enviado',
  'Entregado',
  'Cancelado',
  'Reembolsado',
];

const validationSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(orderStatusOptions, 'Estado inválido')
    .required('El estado es requerido'),
});



interface OrderFormProps {
  initialData?: Partial<OrderStatusInput>;
  onSuccess: (values: OrderStatusInput) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialData = { status: 'Pendiente' }, onSuccess }) => {
  return (
    <div className="card shadow p-6 mb-6">
      <Formik
        initialValues={initialData as OrderStatusInput}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSuccess(values);
        }}
      >
        {() => (
          <Form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado de la orden</label>
              <Field as="select" name="status" className="select select-bordered w-full">
                <option value="">Selecciona un estado</option>
                {orderStatusOptions.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"

                className="btn btn-primary"
              >
                Guardar Cambios
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrderForm;
