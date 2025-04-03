'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { CategoryInput } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import Loader from '@/lib/components/Loader';

type CategoryFormProps = {
  initialData?: Partial<CategoryInput>;
  regions: RegionItem[];
  onValuesChange: (values: CategoryInput) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData = {
    name: '',
    description: '',
    regionId: '',
    backgroundUrl: '',
  },
  regions,
  onValuesChange,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    regionId: Yup.string().required('La región es requerida'),
    backgroundUrl: Yup.string().url('Debe ser una URL válida').notRequired(),
  });

  const FormObserver: React.FC<{
    onChange: (values: CategoryInput) => void;
  }> = ({ onChange }) => {
    const { values } = useFormikContext<CategoryInput>();
    useEffect(() => {
      onChange(values);
    }, [values, onChange]);
    return null;
  };

  const handlePreview = (url: string) => {
    if (url) {
      setIsLoading(true);
      setPreviewError(false);
      const img = new Image();
      img.src = url;
      img.onload = () => {
        setPreviewUrl(url);
        setIsLoading(false);
      };
      img.onerror = () => {
        setPreviewUrl(null);
        setIsLoading(false);
        setPreviewError(true);
      };
    } else {
      setPreviewUrl(null);
      setPreviewError(false);
    }
  };

  return (
    <div className='card shadow p-6 mb-6'>
      <Formik
        initialValues={initialData as CategoryInput}
        validationSchema={validationSchema}
        onSubmit={values => {}}
      >
        {({ values }) => (
          <Form className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Nombre</label>
              <Field name='name' type='text' className='input input-bordered w-full' />
              <ErrorMessage name='name' component='div' className='text-red-500 text-sm' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Descripción</label>
              <Field
                name='description'
                as='textarea'
                className='textarea textarea-bordered w-full'
              />
              <ErrorMessage name='description' component='div' className='text-red-500 text-sm' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Región</label>
              <Field as='select' name='regionId' className='select select-bordered w-full'>
                <option value=''>Selecciona una región</option>
                {regions.map(r => (
                  <option key={r.code} value={r.code}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name='regionId' component='div' className='text-red-500 text-sm' />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>URL de Fondo</label>
              <Field
                name='backgroundUrl'
                type='text'
                className='input input-bordered w-full'
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => handlePreview(e.target.value)}
              />
              <ErrorMessage name='backgroundUrl' component='div' className='text-red-500 text-sm' />
              {isLoading && (
                <div className='mt-4 flex justify-center'>
                  <Loader />
                </div>
              )}
              {!isLoading && previewError && (
                <div className='mt-4 text-sm text-red-500'>Vista previa no disponible.</div>
              )}
              {!isLoading && previewUrl && (
                <div className='mt-4'>
                  <p className='text-sm text-gray-500'>Vista previa:</p>
                  <img
                    src={previewUrl}
                    alt='Vista previa'
                    className='w-full h-40 object-cover border rounded'
                  />
                </div>
              )}
            </div>
            <FormObserver onChange={onValuesChange} />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CategoryForm;
