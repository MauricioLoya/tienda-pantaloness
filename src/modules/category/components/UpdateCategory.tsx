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
  const [updatedCategory] = useState<CategoryItem>({
    id: category.id,
    name: category.name || '',
    description: category.description || '',
    regionId: category.regionId || '',
    backgroundUrl: category.backgroundUrl || '',
  });
  const { showToast } = useToast();

  const handleValuesChange = (values: CategoryInput) => {
    updatedCategory.name = values.name;
    updatedCategory.description = values.description;
    updatedCategory.regionId = values.regionId;
    updatedCategory.backgroundUrl = values.backgroundUrl;
  }

  const handleSubmit = async (close: () => void) => {
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
      title={`Actualizar Categoría`}
      triggerBtnTitle='Actualizar'
      actionBtnText='Actualizar Cambios'
      triggerBtnContent={<FaEdit />}
      cancelBtnText='Cancelar'
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log('Cancelar')}
      fullScreen={false}
    >
      <CategoryForm
        onValuesChange={handleValuesChange}
        initialData={updatedCategory}
        regions={regions}
      />
    </ModalGeneric>
  );
};

export default UpdateCategory;
