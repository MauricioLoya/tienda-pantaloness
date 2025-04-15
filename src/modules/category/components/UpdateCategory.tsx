'use client';

import React, { useState } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import CategoryForm from './CategoryForm';
import { CategoryInput, CategoryItem } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import { useRouter } from 'next/navigation';
import { updateCategoryAction } from '../action/updateCategoryAction';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';

interface UpdateCategoryProps {
  category: CategoryItem;
  regions: RegionItem[];
}

const UpdateCategory: React.FC<UpdateCategoryProps> = ({ category, regions }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [updatedCategory, setUpdatedCategory] = useState<CategoryItem>({
    id: category.id,
    name: category.name || '',
    description: category.description || '',
    regionId: category.regionId || '',
    backgroundUrl: category.backgroundUrl || '',
  });
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const handleValuesChange = (values: CategoryInput) => {
    updatedCategory.name = values.name;
    updatedCategory.description = values.description;
    updatedCategory.regionId = values.regionId;
    updatedCategory.backgroundUrl = values.backgroundUrl;
  };

  const handleSubmit = async (close: () => void) => {
    if (!isFormValid) {
      showToast('Por favor, corrige los errores en el formulario.', 'error');
      return;
    }
    try {
      await updateCategoryAction(updatedCategory);
      router.refresh();
      showToast('Categoría actualizada correctamente', 'success');
      close();
    } catch (error: unknown) {
      showToast(
        error instanceof Error ? error.message : 'Error al actualizar la categoría',
        'error'
      );
      console.error(error);
    }
  };

  return (
    <ModalGeneric
      title="Actualizar Categoría"
      triggerBtnTitle="Actualizar"
      triggerBtnContent={<FaEdit />}
      actionBtnText="Actualizar Cambios"
      cancelBtnText="Cancelar"
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log('Cancelar')}
      fullScreen={false}
    >
      <CategoryForm
        initialData={updatedCategory}
        onValuesChange={handleValuesChange}
        regions={regions}
        onValidityChange={setIsFormValid}
      />
    </ModalGeneric>
  );
};

export default UpdateCategory;
