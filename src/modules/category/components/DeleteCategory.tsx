'use client';

import React from "react";
import ConfirmModal from "@/lib/components/ConfirmModal";
import { CategoryItem } from "../definitions";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "../action/deleteCategoryAction";
import { FaTrash } from "react-icons/fa";
import { useToast } from '@/lib/components/ToastContext';

interface DeleteCategoryProps {
  category: CategoryItem;
  btnColor?: string;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ category, btnColor="btn-danger" }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    await deleteCategoryAction(category.id);
    showToast("Categoría eliminada correctamente", "success");
    router.refresh();
  };

  return (
    <ConfirmModal
      title="Eliminar Categoría"
      message={`¿Estás seguro de eliminar la categoría "${category.name}"?`}
      triggerBtnTitle="Eliminar"
      triggerBtnContent={<FaTrash />}
      confirmBtnText="Sí, eliminar"
      cancelBtnText="Cancelar"
      onConfirm={handleConfirmDelete}
    />
  );
};

export default DeleteCategory;
