'use client';

import React, { useState } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import SectionForm from './SectionForm';
import { HighlightProductItem, SectionInput, SectionItem } from '../definitions';
import { RegionItem } from '@/modules/region/definitions';
import { useRouter } from 'next/navigation';
import { updateSectionAction } from '../actions/updateSectionAction';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';

interface UpdateSectionProps {
  section: SectionItem;
  regions: RegionItem[];
  availableProducts: HighlightProductItem[];
  usedOrders?: number[];
}

const UpdateSection: React.FC<UpdateSectionProps> = ({
  section,
  regions,
  availableProducts,
  usedOrders,
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [updatedSection, setUpdatedSection] = useState<SectionItem>({
    ...section,
  });
  const DefaultColors = {
    buttonText: '#063d79',
    buttonColor: '#000000',
  };
  const handleValuesChange = (values: SectionInput) => {
    console.log(values);
    setUpdatedSection(prev => ({
      ...prev,
      type: values.type,
      title: values.title,
      description: values.description,
      regionId: values.regionId,
      actionUrl: values.actionUrl,
      order: values.order,
      backgroundUrl: values.backgroundUrl,
      backgroundColor: values.backgroundColor,
      highlightProducts: values.highlightProducts ?? [],
      buttonText: values.buttonText ?? DefaultColors.buttonText,
      buttonColor: values.buttonColor ?? DefaultColors.buttonColor,
    }));
  };

  const handleSubmit = async (close: () => void) => {
    try {
      console.log(updatedSection);

      await updateSectionAction(updatedSection.id, updatedSection);
      router.refresh();
      showToast('Sección actualizada correctamente', 'success');
      close();
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Error al actualizar la sección', 'error');
      console.error(error);
    }
  };

  return (
    <ModalGeneric
      title='Actualizar Sección'
      triggerBtnTitle='Actualizar'
      triggerBtnContent={<FaEdit />}
      actionBtnText='Actualizar Cambios'
      cancelBtnText='Cancelar'
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log('Cancelar')}
      fullScreen={false}
    >
      <SectionForm
        onValuesChange={handleValuesChange}
        initialData={updatedSection}
        regions={regions}
        availableProducts={availableProducts}
        usedOrders={usedOrders}
      />
    </ModalGeneric>
  );
};

export default UpdateSection;
