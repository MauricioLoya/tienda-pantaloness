'use client';

import React from 'react';
import ConfirmModal from '@/lib/components/ConfirmModal';
import { ProductItem } from '../definitions';
import { useRouter } from 'next/navigation';
import { FaCheckCircle } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { activateProductAction } from '../actions/activateProductAction';

interface ActivateProductProps {
  product: ProductItem;
  btnColor?: string;
}

const ActivateProduct: React.FC<ActivateProductProps> = ({
  product,
  btnColor = 'btn-danger',
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmActivate = async () => {
    await activateProductAction(product.id);
    showToast('Producto activado correctamente', 'success');
    router.refresh();
  };

  return (
    <ConfirmModal
      title='Activar Categoría'
      message={`¿Estás seguro de activar el producto "${product.name}"?`}
      triggerBtnTitle='Activar'
      triggerBtnContent={<FaCheckCircle />}
      confirmBtnText='Sí, activar'
      cancelBtnText='Cancelar'
      onConfirm={handleConfirmActivate}
      btnColor={btnColor}
    />
  );
};

export default ActivateProduct;
