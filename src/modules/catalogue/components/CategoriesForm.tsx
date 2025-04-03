'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addCategoryAction } from '../actions/addCategoryAction';
import { removeCategoryAction } from '../actions/removeCategoryAction';
import { useRouter } from 'next/navigation';
import { CategoryItem } from '@/modules/category/definitions';
import { useToast } from '@/lib/components/ToastContext';

interface CategoriesFormProps {
  productId?: number;
  categories?: CategoryItem[];
  allCategories: CategoryItem[];
}

interface CategoryFormValues {
  selectedCat: string;
}

const CategorySchema = Yup.object().shape({
  selectedCat: Yup.string().required('Selecciona una categoría'),
});

const CategoriesForm: React.FC<CategoriesFormProps> = ({
  productId,
  categories = [],
  allCategories = [],
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const availableCats = allCategories.filter(c => !categories.some(cc => cc.id === c.id));

  const handleAdd = async (
    values: CategoryFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!values.selectedCat || !productId) return;
    const catId = parseInt(values.selectedCat, 10);
    try {
      await addCategoryAction(productId, catId);
      resetForm();
      router.refresh();
      showToast('Categoría agregada correctamente', 'success');
    } catch (error: any) {
      showToast(error.message || 'Error al agregar la categoría', 'error');
    }
  };

  async function handleRemove(categoryId: number) {
    if (productId) {
      try {
        await removeCategoryAction(productId, categoryId);
        router.refresh();
        showToast('Categoría eliminada correctamente', 'success');
      } catch (error: any) {
        showToast(error.message || 'Error al eliminar la categoría', 'error');
      }
    }
  }

  return (
    <div className='card shadow p-4'>
      <div className='grid gap-5'>
        <h2 className='text-xl font-bold'>Categorías</h2>
        <Formik
          initialValues={{ selectedCat: '' }}
          validationSchema={CategorySchema}
          onSubmit={handleAdd}
        >
          {({ isSubmitting }) => (
            <Form className='flex flex-col gap-2'>
              <div className='flex gap-2'>
                <Field as='select' name='selectedCat' className='select select-bordered w-full'>
                  <option value=''>Selecciona una categoría</option>
                  {availableCats.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Field>
                <button
                  type='submit'
                  disabled={isSubmitting || !productId}
                  className='btn btn-secondary'
                >
                  Agregar
                </button>
              </div>
              <ErrorMessage
                name='selectedCat'
                component='div'
                className='text-error text-sm mt-1'
              />
            </Form>
          )}
        </Formik>
        <div className='flex flex-wrap gap-2'>
          {categories.map(cat => (
            <div key={cat.id} className='flex gap-2'>
              <button className='btn flex-wrap'>
                {cat.name}
                <div
                  className='btn btn-xs btn-circle btn-error'
                  onClick={() => handleRemove(cat.id)}
                >
                  X
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesForm;
