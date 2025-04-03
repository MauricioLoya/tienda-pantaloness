'use client';
import React, { useState } from 'react';
import ModalGeneric from '@/lib/components/ModalGeneric';
import PromotionForm from './PromotionForm';
import { PromotionInput, PromotionItem } from '../definitions';
import { useRouter } from 'next/navigation';
import { UpdatePromotionAction } from '../actions/updatePromotionAction';
import { FaEdit } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { RegionItem } from '@/modules/region/definitions';

interface UpdatePromotionProps {
  promotion: PromotionItem;
  regions: RegionItem[];
}

const UpdatePromotion: React.FC<UpdatePromotionProps> = ({ promotion, regions }) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [updatedPromotion] = useState<PromotionItem>({
    id: promotion.id,
    code: promotion.code,
    name: promotion.name,
    description: promotion.description,
    discount: promotion.discount,
    regionId: promotion.regionId,
    startDate: promotion.startDate,
    endDate: promotion.endDate,
    active: promotion.active,
    isDeleted: promotion.isDeleted,
    createdAt: promotion.createdAt,
  })

  const handleValuesChange = (values: PromotionInput) => {
    updatedPromotion.code = values.code;
    updatedPromotion.name = values.name;
    updatedPromotion.description = values.description;
    updatedPromotion.discount = values.discount;
    updatedPromotion.regionId = values.regionId;
    updatedPromotion.startDate = values.startDate;
    updatedPromotion.endDate = values.endDate;
    updatedPromotion.active = values.active;
  };

  const handleSubmit = async (close: () => void) => {
    try {
      await UpdatePromotionAction(updatedPromotion);
      router.refresh();
      showToast('Promoción actualizada correctamente', 'success');
      close();
    } catch (errors) {
      showToast('Por favor, corrige los errores en el formulario.', 'error');
      console.error(errors)
    }
  };

  return (
    <ModalGeneric
      title='Actualizar Promoción'
      triggerBtnTitle='Actualizar'
      triggerBtnContent={<FaEdit />}
      actionBtnText='Actualizar Cambios'
      cancelBtnText='Cancelar'
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log('Cancelar')}
    >
      <PromotionForm
        initialData={updatedPromotion}
        onValuesChange={handleValuesChange}
        regions={regions}
      />
    </ModalGeneric>
  );
};

export default UpdatePromotion;
