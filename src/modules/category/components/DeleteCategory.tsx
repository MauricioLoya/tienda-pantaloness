'use client';

import React from "react";
import ConfirmModal from "@/lib/components/ConfirmModal";
import { CategoryItem } from "../definitions";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "../action/deleteCategoryAction";

interface DeleteCategoryModalProps {
  category: CategoryItem;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ category }) => {
  const router = useRouter();

  const handleConfirmDelete = async () => {
    await deleteCategoryAction(category.id);
    router.refresh();
  };

  return (
    <ConfirmModal
      title="Eliminar Categoría"
      message={`¿Estás seguro de eliminar la categoría "${category.name}"?`}
      triggerBtnTitle="Eliminar Categoría"
      confirmBtnText="Sí, eliminar"
      cancelBtnText="Cancelar"
      onConfirm={handleConfirmDelete}
    />
  );
};

export default DeleteCategoryModal;
