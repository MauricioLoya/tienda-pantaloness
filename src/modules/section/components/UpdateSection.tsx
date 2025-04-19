'use client';

import React from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import SectionForm from './SectionForm';
import { HighlightProductItem, SectionInput, SectionItem, UsedOrdersByRegion } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import { useRouter } from 'next/navigation';
import { updateSectionAction } from '../actions/updateSectionAction';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';

interface UpdateSectionProps {
  section: SectionItem;
  regions: RegionItem[];
  availableProducts: HighlightProductItem[];
  usedOrdersByRegion?: UsedOrdersByRegion;
}

const UpdateSection: React.FC<UpdateSectionProps> = ({
  section,
  regions,
  availableProducts,
  usedOrdersByRegion,
}) => {

  const router = useRouter();
  const { showToast } = useToast();

  return (
    <ModalGeneric
      title='Actualizar Sección'
      triggerBtnTitle='Actualizar'
      triggerBtnContent={<FaEdit />}

      fullScreen={false}
    >

      {(closeModal) => (
        <SectionForm
          regions={regions}
          availableProducts={availableProducts}
          usedOrdersByRegion={usedOrdersByRegion}
          initialData={
            {
              type: section.type,
              title: section.title,
              regionId: section.regionId,
              description: section.description,
              buttonText: section.buttonText,
              buttonColor: section.buttonColor,
              actionUrl: section.actionUrl,
              backgroundColor: section.backgroundColor,
              backgroundUrl: section.backgroundUrl,
              highlightProducts: section.highlightProducts,
              order: section.order,
            }
          }
          onSuccess={async (values: SectionInput) => {
            await updateSectionAction(section.id, {
              type: values.type,
              title: values.title,
              regionId: values.regionId,
              description: values.description,
              buttonText: values.buttonText,
              buttonColor: values.buttonColor,
              actionUrl: values.actionUrl,
              backgroundColor: values.backgroundColor,
              backgroundUrl: values.backgroundUrl,
              highlightProducts: values.highlightProducts,
              order: section.order,
            });
            showToast('Sección actualizada correctamente', 'success');
            router.refresh();
          }}
          onClose={closeModal}
        />
      )}
    </ModalGeneric>
  );
};

export default UpdateSection;
