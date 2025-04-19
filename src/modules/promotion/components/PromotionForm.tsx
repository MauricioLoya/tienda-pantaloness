'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RegionItem } from '@/modules/region/definitions';
import { PromotionInput } from '../definitions';


type PromotionFormProps = {
  initialData?: Partial<PromotionInput>;
  regions: RegionItem[];
  onSuccess: (values: PromotionInput) => void;
  onClose: () => void;
};

const PromotionForm: React.FC<PromotionFormProps> = ({
  initialData = {
    code: '',
    name: '',
    description: '',
    discount: 0,
    startDate: '',
    endDate: '',
    active: false,
    regionId: '',
  },
  regions,
  onSuccess,
  onClose,
}) => {


  const PromotionSchema = Yup.object().shape({
    code: Yup.string()
      .required('El código es requerido')
      .matches(/^[a-zA-Z0-9]+$/, 'Solo se permiten letras y números')
      .min(4, 'Mínimo 4 caracteres')
      .max(10, 'Máximo 10 caracteres'),
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    discount: Yup.number()
      .min(0, 'El descuento debe ser mayor o igual a 0')
      .max(100, 'El descuento debe ser menor o igual a 100')
      .required('El descuento es requerido'),
    startDate: Yup.date().required('La fecha de inicio es requerida'),
    endDate: Yup.date()
      .required('La fecha de fin es requerida')
      .min(Yup.ref('startDate'), 'La fecha de fin debe ser posterior a la fecha de inicio'),
    active: Yup.boolean(),
    regionId: Yup.string().required('La región es requerida'),
  });



  return (
    <div className=''>
      <Formik
        initialValues={initialData as PromotionInput}
        validationSchema={PromotionSchema}
        onSubmit={values => {
          onSuccess(values);
          onClose();
        }}
      >
        {() => (
          <Form>
            <div className='mb-4'>
              <label className='block text-gray-700'>Código:</label>
              <Field
                name='code'
                type='text'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              />
              <ErrorMessage name='code' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Nombre:</label>
              <Field
                name='name'
                type='text'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              />
              <ErrorMessage name='name' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Descripción:</label>
              <Field
                name='description'
                as='textarea'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              />
              <ErrorMessage name='description' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Descuento (%):</label>
              <Field
                name='discount'
                type='number'
                step='0.01'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              />
              <ErrorMessage name='discount' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Fecha de inicio:</label>
              <Field
                name='startDate'
                type='date'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              />
              <ErrorMessage name='startDate' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Fecha de fin:</label>
              <Field
                name='endDate'
                type='date'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              />
              <ErrorMessage name='endDate' component='div' className='text-red-500 text-sm' />
            </div>
            <div className='mb-4 flex items-center'>
              <Field name='active' type='checkbox' className='mr-2' />
              <label className='text-gray-700'>Activo</label>
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Región:</label>
              <Field
                as='select'
                name='regionId'
                className='mt-1 block w-full border border-gray-300 rounded p-2'
              >
                <option value=''>Selecciona una región</option>
                {regions.map(r => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='regionId' component='div' className='text-red-500 text-sm' />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PromotionForm;
