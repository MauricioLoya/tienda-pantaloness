'use client';
import React from 'react';
import ConfirmModal from '@/lib/components/ConfirmModal';
import { PromotionItem } from '../definitions';
import { useRouter } from 'next/navigation';
import { ActivatePromotionAction } from '../actions/activatePromotionAction';
import { FaCheckCircle } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';

interface ActivatePromotionProps {
  promotion: PromotionItem;
  btnColor?: string;
}

const ActivatePromotion: React.FC<ActivatePromotionProps> = ({
  promotion,
  btnColor = 'btn-success',
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmActivate = async () => {
    try {
      await ActivatePromotionAction(promotion.id);
      showToast('Promoción activada correctamente', 'success');
      router.refresh();
    } catch (error: any) {
      showToast('Error al activar la promoción', 'error');
    }
  };

  return (
    <ConfirmModal
      title='Activar Promoción'
      message={`¿Estás seguro de activar la promoción "${promotion.name}"?`}
      triggerBtnTitle='Activar'
      triggerBtnContent={<FaCheckCircle />}
      confirmBtnText='Sí, activar'
      cancelBtnText='Cancelar'
      onConfirm={handleConfirmActivate}
      btnColor={btnColor}
    />
  );
};

export default ActivatePromotion;
