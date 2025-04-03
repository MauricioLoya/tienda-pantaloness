'use client';

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addVariantAction } from '../actions/addVariantAction';
import { removeVariantAction } from '../actions/removeVariantAction';
import { useRouter } from 'next/navigation';
import { VariantItem } from '../definitions';
import DisplayTableInfo from '@/lib/components/DisplayTableInfo';
import ActionButton from '@/lib/components/ActionButton';
import { useToast } from '@/lib/components/ToastContext';
import { formatPrice } from '@/lib/utils';

interface VariantsFormProps {
  productId?: number;
  variants?: VariantItem[];
}

interface VariantFormValues {
  size: string;
  price: string;
  stock: string;
  discount: string;
}

const VariantSchema = Yup.object().shape({
  size: Yup.string().required('El tamaño es requerido'),
  price: Yup.number()
    .typeError('El precio debe ser un número')
    .positive('El precio debe ser mayor a 0')
    .required('El precio es requerido'),
  stock: Yup.number()
    .typeError('El stock debe ser un número')
    .integer('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo')
    .required('El stock es requerido'),
  discount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? 0 : value))
    .min(0, 'El descuento no puede ser negativo')
    .max(100, 'El descuento no puede ser mayor a 100')
    .notRequired(),
});

const VariantsForm: React.FC<VariantsFormProps> = ({ productId, variants = [] }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const calculateDiscountedPrice = (price: number, discount: number) => {
    const dp = price * (1 - discount / 100);
    return Math.round(dp * 100) / 100;
  };

  async function handleSubmit(values: VariantFormValues, { resetForm }: { resetForm: () => void }) {
    const discountValue = values.discount === '' ? 0 : parseFloat(values.discount);
    const priceValue = parseFloat(values.price);
    const stockValue = parseInt(values.stock, 10);

    try {
      if (!productId) return;
      await addVariantAction(productId, values.size.trim(), priceValue, stockValue, discountValue);
      resetForm();
      router.refresh();
      showToast('Variante agregada correctamente', 'success');
    } catch (error: Error | unknown) {
      showToast(error instanceof Error ? error.message : 'Error al agregar la variante', 'error');
    }
  }

  async function handleRemove(variantId: number) {
    try {
      await removeVariantAction(variantId);
      router.refresh();
      showToast('Variante eliminada correctamente', 'success');
    } catch (error: Error | unknown) {
      showToast(error instanceof Error ? error.message : 'Error al eliminar la variante', 'error');
    }
  }

  const variantsData = variants.map(variant => ({
    id: variant.id,
    Tamaño: variant.size,
    Precio: formatPrice(variant.price),
    Stock: variant.stock,
    Descuento: `${variant.discount} %` || 0,
    'Precio con Descuento': formatPrice(variant.discountPrice ?? 0),
    Eliminar: (
      <ActionButton
        onClick={() => {
          handleRemove(variant.id);
        }}
      />
    ),
  }));

  return (
    <div className='card shadow p-4'>
      <h2 className='text-xl font-bold mb-2'>Variantes</h2>
      <Formik
        initialValues={{ size: '', price: '', stock: '', discount: '' }}
        validationSchema={VariantSchema}
        onSubmit={handleSubmit}
      >
        {({ values }) => {
          const priceVal = parseFloat(values.price);
          const discountVal = values.discount === '' ? 0 : parseFloat(values.discount);
          const computedDiscountedPrice =
            !isNaN(priceVal) && !isNaN(discountVal)
              ? calculateDiscountedPrice(priceVal, discountVal)
              : null;
          return (
            <Form className='mb-4'>
              <div className='grid grid-cols-5 gap-2 mb-2'>
                <div className='col-span-1'>
                  <Field
                    type='text'
                    name='size'
                    placeholder='Tamaño'
                    className='input input-bordered w-full'
                  />
                  <ErrorMessage name='size' component='div' className='text-error text-sm' />
                </div>
                <div className='col-span-1'>
                  <Field
                    type='number'
                    name='price'
                    placeholder='Precio'
                    className='input input-bordered w-full'
                  />
                  <ErrorMessage name='price' component='div' className='text-error text-sm' />
                </div>
                <div className='col-span-1'>
                  <Field
                    type='number'
                    name='stock'
                    placeholder='Stock'
                    className='input input-bordered w-full'
                  />
                  <ErrorMessage name='stock' component='div' className='text-error text-sm' />
                </div>
                <div className='col-span-1'>
                  <Field
                    type='number'
                    name='discount'
                    placeholder='Descuento (%)'
                    className='input input-bordered w-full'
                  />
                  <ErrorMessage name='discount' component='div' className='text-error text-sm' />
                </div>
                <div className='col-span-1'>
                  <button type='submit' className='btn btn-secondary w-full'>
                    Agregar
                  </button>
                </div>
              </div>
              {computedDiscountedPrice !== null && discountVal > 0 && (
                <div className='mb-2'>
                  <p className='text-sm'>
                    Descuento: ${(priceVal - computedDiscountedPrice).toFixed(2)}
                  </p>
                  <p className='text-sm'>Precio Final: ${computedDiscountedPrice.toFixed(2)}</p>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
      <div className='overflow-x-auto'>
        <DisplayTableInfo
          headers={['Tamaño', 'Precio', 'Stock', 'Descuento', 'Precio con Descuento', 'Eliminar']}
          data={variantsData}
          keyField='id'
        />
      </div>
    </div>
  );
};

export default VariantsForm;
