'use client';

import React, { useState } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import SectionForm from './SectionForm';
import { RegionItem } from '@/modules/region/definitions';
import { useRouter } from 'next/navigation';
import { createSectionAction } from '../actions/createSectionAction';
import { SectionType } from '@prisma/client';
import { HighlightProductItem, SectionInput } from '../definitions';

interface CreateSectionProps {
  regions: RegionItem[];
  availableProducts: HighlightProductItem[];
  usedOrders?: number[];
}

const CreateSection: React.FC<CreateSectionProps> = ({
  regions,
  availableProducts,
  usedOrders,
}) => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<SectionInput>({
    type: SectionType.banner,
    title: '',
    description: '',
    regionId: '',
    actionUrl: '',
    order: 1,
    backgroundUrl: '',
    backgroundColor: '#063d79',
  });

  const handleSubmit = async (close: () => void) => {
    try {
      await createSectionAction(formValues);
      close();
      router.refresh();
    } catch (error: unknown) {
      console.error('Error creating section:', error);
    }
  };

  return (
    <ModalGeneric
      title='Crear Sección'
      triggerBtnTitle='Agregar Sección'
      actionBtnText='Guardar'
      cancelBtnText='Cancelar'
      actionBtnFunction={close => handleSubmit(close)}
      cancelBtnFunction={() => {}}
      fullScreen={false}
    >
      <SectionForm
        onValuesChange={values => setFormValues(values)}
        regions={regions}
        availableProducts={availableProducts}
        usedOrders={usedOrders}
      />
    </ModalGeneric>
  );
};

export default CreateSection;
