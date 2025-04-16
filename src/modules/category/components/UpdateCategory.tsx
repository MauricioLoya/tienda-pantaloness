'use client';

import React from 'react';
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


  return (
    <ModalGeneric
      title="Actualizar Categoría"
      triggerBtnTitle="Actualizar"
      triggerBtnContent={<FaEdit />}
      fullScreen={false}
    >
      <CategoryForm
        initialData={{
          name: category.name,
          description: category.description,
          regionId: category.regionId,
          backgroundUrl: category.backgroundUrl,
        }}
        regions={regions}
        onSuccess={async (values: CategoryInput) => {
          await updateCategoryAction({
            id: category.id,
            ...values,
          });
          showToast('Categoría actualizada correctamente', 'success');
          router.refresh();
        }}

      />
    </ModalGeneric>
  );
};

export default UpdateCategory;
