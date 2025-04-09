'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createProductAction } from '../actions/createProductAction';
import { updateProductAction } from '../actions/updateProductAction';
import { ProductInput } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import { generateSlug } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/components/ToastContext';

interface BasicFormProps {
  productId?: number;
  initialData?: Partial<ProductInput>;
  regions: RegionItem[];
}

const BasicForm: React.FC<BasicFormProps> = ({
  productId,
  initialData = {
    name: '',
    description: '',
    active: true,
    slug: '',
    regionId: '',
  },
  regions,
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const schema = Yup.object().shape({
    name: Yup.string().required('Nombre requerido'),
    description: Yup.string().required('Descripción requerida'),
    active: Yup.boolean(),
    regionId: Yup.string().required('Región es requerida'),
    slug: Yup.string(),
  });

  async function handleSubmit(values: ProductInput) {
    try {
      if (!productId) {
        const product = await createProductAction(values);
        showToast('Producto creado correctamente', 'success');
        router.push(`/admin/products/${product.id}/edit`);
      } else {
        await updateProductAction(productId, values);
        showToast('Producto actualizado correctamente', 'success');
        router.refresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || 'Error al guardar el producto', 'error');
      } else {
        showToast('Error desconocido al guardar el producto', 'error');
      }
    }
  }

  return (
    <div className='card shadow p-4 '>
      <h2 className='text-xl font-bold mb-2'>Información base</h2>
      <Formik
        initialValues={initialData as ProductInput}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className='flex flex-col gap-3'>
            <div>
              <label className='block text-gray-700'>Nombre</label>
              <Field
                name='name'
                type='text'
                className='input input-bordered w-full'
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const newSlug = generateSlug(e.target.value);
                  setFieldValue('slug', newSlug);
                }}
              />
              <ErrorMessage name='name' component='div' className='text-error' />
            </div>
            <div>
              <label className='block text-gray-700'>Slug</label>
              <Field name='slug' type='text' className='input input-bordered w-full' disabled />
            </div>
            <div>
              <label className='block text-gray-700'>Descripción</label>
              <Field
                name='description'
                as='textarea'
                className='textarea textarea-bordered w-full'
              />
              <ErrorMessage name='description' component='div' className='text-error' />
            </div>
            <div>
              <label className='block text-gray-700'>Región</label>
              <Field as='select' name='regionId' className='select select-bordered w-full'>
                <option value=''>Selecciona una región</option>
                {regions.map(r => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='regionId' component='div' className='text-error' />
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-gray-700'>Activo</label>
              <Field name='active' type='checkbox' className='toggle' />
            </div>
            <button type='submit' disabled={isSubmitting} className='btn btn-primary mt-2 self-end'>
              Guardar
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BasicForm;
