'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { RegionItem } from '@/modules/region/definitions';
import Loader from '@/lib/components/Loader';
import { SectionType } from '@prisma/client';
import HighlightProductSelector from './HighlightProductSelector';
import { HighlightProductItem, SectionInput, UsedOrdersByRegion } from '../definitions';


const buttonColorOptions = [
  'btn-primary',
  'btn-secondary',
  'btn-accent',
  'btn-info',
  'btn-success',
  'btn-warning',
  'btn-error',
];

type SectionFormProps = {
  initialData?: Partial<SectionInput>;
  regions: RegionItem[];
  availableProducts?: HighlightProductItem[];
  usedOrdersByRegion?: UsedOrdersByRegion;

  onSuccess: (values: SectionInput) => void;
  onClose: () => void;
};

const SectionForm: React.FC<SectionFormProps> = ({
  initialData = {
    type: SectionType.banner,
    title: '',
    description: '',
    regionId: '',
    actionUrl: '',
    order: 1,
    backgroundUrl: '',
    backgroundColor: '#063d79',
    buttonText: '',
    buttonColor: '',
    highlightProducts: [],
  },
  regions,
  availableProducts = [],
  usedOrdersByRegion = {},
  onSuccess,
  onClose,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);


  const validationSchema = Yup.object().shape({
    type: Yup.mixed<SectionType>().oneOf(Object.values(SectionType)).required(),
    title: Yup.string().required('El título es requerido'),
    description: Yup.string().required('La descripción es requerida'),
    regionId: Yup.string().required('La región es requerida'),
    actionUrl: Yup.string().url('Debe ser una URL válida').notRequired(),
    order: Yup.number()
      .min(1, 'El orden debe ser al menos 1')
      .test(
        'unique-order-region',
        function (value) {
          const { regionId } = this.parent;
          if (!regionId || !usedOrdersByRegion || !usedOrdersByRegion[regionId]) return true;
          const ordersForRegion = usedOrdersByRegion[regionId];
          if (value !== undefined && ordersForRegion.includes(value)) {
            return this.createError({
              message: `El orden ${value} ya está ocupado en la región ${regionId}. Órdenes usadas: ${ordersForRegion.join(', ')}`,
            });
          }
          return true;
        }
      ),
    backgroundUrl: Yup.string().url('Debe ser una URL válida').required('La URL es requerida'),
    backgroundColor: Yup.string().required("El color de fondo es requerido"),
    buttonText: Yup.string().required('El texto del botón es requerido'),
    buttonColor: Yup.string().required('El color del botón es requerido'),
    highlightProducts: Yup.array()
      .of(Yup.number())
      .when('type', {
        is: (value: SectionType) => value === SectionType.highlight,
        then: () => Yup.array().min(1, 'Debes seleccionar al menos un producto destacado'),
        otherwise: () => Yup.array().notRequired(),
      }),
  });



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
        initialValues={initialData as SectionInput}
        validationSchema={validationSchema}
        onSubmit={values => {
          onSuccess(values);
          onClose();
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>Tipo de Sección</label>
              <Field as='select' name='type' className='select select-bordered w-full'>
                <option value={SectionType.banner}>Banner</option>
                <option value={SectionType.highlight}>Destacados</option>
              </Field>
              <ErrorMessage name='type' component='div' className='text-red-500 text-sm' />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Título</label>
              <Field name='title' type='text' className='input input-bordered w-full' />
              <ErrorMessage name='title' component='div' className='text-red-500 text-sm' />
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
              <label className='block text-sm font-medium text-gray-700'>Texto del Botón</label>
              <Field
                name='buttonText'
                type='text'
                className='input input-bordered w-full'
                placeholder='Ej: Ir a la sección'
              />
              <ErrorMessage name='buttonText' component='div' className='text-red-500 text-sm' />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Color del Botón</label>
              <div className='flex items-start justify-between gap-4'>
                <Field
                  as='select'
                  name='buttonColor'
                  className='select select-bordered w-full md:w-1/2'
                >
                  <option value=''>Selecciona un color</option>
                  {buttonColorOptions.map(color => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </Field>

                {values.buttonColor && (
                  <div className='flex items-center justify-center w-full md:w-1/2'>
                    <span className={`btn ${values.buttonColor}`}>{values.buttonText}</span>
                  </div>
                )}
              </div>

              <ErrorMessage
                name='buttonColor'
                component='div'
                className='text-red-500 text-sm mt-2'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>
                URL de Acción (link)
              </label>
              <Field name='actionUrl' type='text' className='input input-bordered w-full' />
              <ErrorMessage name='actionUrl' component='div' className='text-red-500 text-sm' />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700'>Orden</label>
              <Field name='order' type='number' className='input input-bordered w-full' />
              <ErrorMessage name='order' component='div' className='text-red-500 text-sm' />
            </div>
            {values.type === SectionType.highlight && (
              <>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>Color de Fondo</label>
                  <Field name='backgroundColor' type='color' className='input input-bordered w-16' />
                  <ErrorMessage
                    name='backgroundColor'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
                <HighlightProductSelector
                  selected={values.highlightProducts ?? []}
                  availableProducts={availableProducts}
                  onChange={selected => {
                    setFieldValue('highlightProducts', selected);
                  }}
                />
              </>
            )}

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

export default SectionForm;
