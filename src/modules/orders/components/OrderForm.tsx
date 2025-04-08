'use client';

import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { OrderStatusInput } from '../definitions';

const orderStatusOptions = [
  'Procesando',
  'Enviado',
  'Entregado',
  'Cancelado',
  'Reembolsado',
  'Preparando envío',
];

const validationSchema = Yup.object().shape({
  status: Yup.string()
    .oneOf(orderStatusOptions, 'Estado inválido')
    .required('El estado es requerido'),
});

const FormObserver: React.FC<{ onChange: (values: OrderStatusInput) => void }> = ({ onChange }) => {
  const { values } = useFormikContext<OrderStatusInput>();
  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return null;
};

interface OrderFormProps {
  initialData?: Partial<OrderStatusInput>;
  onValuesChange: (values: OrderStatusInput) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ initialData = { status: 'Pendiente' }, onValuesChange }) => {
  return (
    <div className="card shadow p-6 mb-6">
      <Formik
        initialValues={initialData as OrderStatusInput}
        validationSchema={validationSchema}
        onSubmit={() => { }}
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
            <FormObserver onChange={onValuesChange} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrderForm;
