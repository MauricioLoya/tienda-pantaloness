'use client';

import React from 'react';
import ConfirmModal from '@/lib/components/ConfirmModal';
import { ProductItem } from '../definitions';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { useToast } from '@/lib/components/ToastContext';
import { deleteProductAction } from '../actions/deleteProductAction';

interface DeleteProductProps {
  product: ProductItem;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({ product }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    await deleteProductAction(product.id);
    showToast('Producto eliminado correctamente', 'success');
    router.refresh();
  };

  return (
    <ConfirmModal
      title='Eliminar Categoría'
      message={`¿Estás seguro de eliminar el producto "${product.name}"?`}
      triggerBtnTitle='Eliminar'
      triggerBtnContent={<FaTrash />}
      confirmBtnText='Sí, eliminar'
      cancelBtnText='Cancelar'
      onConfirm={handleConfirmDelete}
    />
  );
};

export default DeleteProduct;
