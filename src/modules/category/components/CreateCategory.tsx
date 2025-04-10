'use client';
import ModalGeneric from '@/lib/components/ModalGeneric';
import React, { useState } from 'react';
import CategoryForm from './CategoryForm';
import { RegionItem } from '@/modules/region/definitions';
import { createCategoryAction } from '../action/createCategoryAction';
import { CategoryInput } from '../definitions';
import { useRouter } from 'next/navigation';

const CreateCategory = ({ regions }: { regions: RegionItem[] }) => {
  const router = useRouter();

  const [formState, setFormState] = useState<CategoryInput>({
    name: '',
    description: '',
    regionId: '',
  });

  const handleValuesChange = (values: CategoryInput) => {
    setFormState(values);
  };
  const handleSubmit = async (close: () => void) => {
    try {
      await createCategoryAction(formState);
      close();
      router.refresh();
    } catch (error: unknown) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <ModalGeneric
      title='Agregar categoria'
      triggerBtnTitle='Agregar'
      actionBtnText='Guardar'
      actionBtnFunction={handleSubmit}
      cancelBtnText='Cancelar'
      cancelBtnFunction={() => console.log('click action cancel')}
    >
      <CategoryForm regions={regions} onValuesChange={handleValuesChange} />
    </ModalGeneric>
  );
};

export default CreateCategory;
