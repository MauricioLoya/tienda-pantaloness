'use client';
import ModalGeneric from '@/lib/components/ModalGeneric';
import React from 'react';
import CategoryForm from './CategoryForm';
import { RegionItem } from '@/modules/region/definitions';

import { useRouter } from 'next/navigation';
import { createCategoryAction } from '../action/createCategoryAction';

const CreateCategory = ({ regions }: { regions: RegionItem[] }) => {
  const router = useRouter();
  return (
    <ModalGeneric
      title='Agregar categoria'
      triggerBtnTitle='Agregar'
    >
      <CategoryForm regions={regions} onSuccess={async (values) => {
        await createCategoryAction(values);
        router.refresh();
      }} />
    </ModalGeneric>
  );
};

export default CreateCategory;
