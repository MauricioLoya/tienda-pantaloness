'use client';

import React from 'react';
import ConfirmModal from '@/lib/components/ConfirmModal';
import { CategoryItem } from '../definitions';
import { useRouter } from 'next/navigation';
import { ActivateCategoryAction } from '../action/activateCategoryAction';
import { FaCheckCircle } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';

interface ActivateCategoryProps {
  category: CategoryItem;
  btnColor?: string;
}

const ActivateCategory: React.FC<ActivateCategoryProps> = ({
  category,
  btnColor = 'btn-danger',
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmActivate = async () => {
    await ActivateCategoryAction(category.id);
    showToast('Categoría activada correctamente', 'success');
    router.refresh();
  };

  return (
    <ConfirmModal
      title='Activar Categoría'
      message={`¿Estás seguro de activar la categoría "${category.name}"?`}
      triggerBtnTitle='Activar'
      triggerBtnContent={<FaCheckCircle />}
      confirmBtnText='Sí, activar'
      cancelBtnText='Cancelar'
      onConfirm={handleConfirmActivate}
      btnColor={btnColor}
    />
  );
};

export default ActivateCategory;
