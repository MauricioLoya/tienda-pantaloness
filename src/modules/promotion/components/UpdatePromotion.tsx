'use client';
import React from 'react';
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

  function formatDateForInput(d?: string | Date): string {
    if (!d) return '';
    const dateObj = typeof d === 'string' ? new Date(d) : d;
    return dateObj.toISOString().slice(0, 10); // "YYYY-MM-DD"
  }
  return (
    <ModalGeneric
      title='Actualizar Promoción'
      triggerBtnTitle='Actualizar'
      triggerBtnContent={<FaEdit />}
    >
      {(closeModal) => (
        <PromotionForm
          initialData={
            {
              name: promotion.name,
              description: promotion.description,
              regionId: promotion.regionId,
              code: promotion.code,
              startDate: formatDateForInput(promotion.startDate),
              endDate: formatDateForInput(promotion.endDate),
              discount: promotion.discount,
              active: promotion.active,
            }
          }
          regions={regions}
          onSuccess={async (values: PromotionInput) => {
            await UpdatePromotionAction({
              id: promotion.id,
              name: values.name,
              description: values.description,
              regionId: values.regionId,
              code: values.code,
              startDate: values.startDate,
              endDate: values.endDate,
              discount: values.discount,
              active: values.active,
              createdAt: promotion.createdAt,
              isDeleted: promotion.isDeleted,
            });
            showToast('Promoción actualizada correctamente', 'success');
            router.refresh();
          }}
          onClose={closeModal}
        />
      )}
    </ModalGeneric>
  );
};

export default UpdatePromotion;
