'use client';

import React from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import SectionForm from './SectionForm';
import { RegionItem } from '@/modules/region/definitions';
import { useRouter } from 'next/navigation';
import { createSectionAction } from '../actions/createSectionAction';
import { useToast } from '@/lib/components/ToastContext';

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
  const { showToast } = useToast()
  return (
    <ModalGeneric
      title='Crear Sección'
      triggerBtnTitle='Agregar Sección'
      fullScreen={false}
    >
      {(closeModal) => (
        <SectionForm
          regions={regions}
          availableProducts={availableProducts}
          usedOrdersByRegion={usedOrdersByRegion}
          onSuccess={async (values) => {
            await createSectionAction({
              ...values,
            });
            showToast('Sección agregado correctamente', 'success');
            router.refresh();
          }}
          onClose={closeModal}
        />
      )}
    </ModalGeneric>
  );
};

export default CreateSection;
