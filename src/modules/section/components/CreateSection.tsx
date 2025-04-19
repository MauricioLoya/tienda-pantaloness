'use client';

import React from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import SectionForm from './SectionForm';
import { RegionItem } from '@/modules/region/definitions';
import { useRouter } from 'next/navigation';
import { createSectionAction } from '../actions/createSectionAction';

import { HighlightProductItem, UsedOrdersByRegion } from '../definitions';

interface CreateSectionProps {
  regions: RegionItem[];
  availableProducts: HighlightProductItem[];
  usedOrdersByRegion?: UsedOrdersByRegion;

}

const CreateSection: React.FC<CreateSectionProps> = ({
  regions,
  availableProducts,
  usedOrdersByRegion,
}) => {
  const router = useRouter();




  return (
    <ModalGeneric
      title='Crear Sección'
      triggerBtnTitle='Agregar Sección'
      fullScreen={false}
    >
      <SectionForm

        regions={regions}
        onSuccess={async (values) => {
          await createSectionAction({
            ...values,
          });
          router.refresh();
        }}
        availableProducts={availableProducts}
        usedOrdersByRegion={usedOrdersByRegion}
      />
    </ModalGeneric>
  );
};

export default CreateSection;
