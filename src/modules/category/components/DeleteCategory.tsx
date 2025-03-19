'use client';

import React from "react";
import ConfirmModal from "@/lib/components/ConfirmModal";
import { CategoryItem } from "../definitions";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "../action/deleteCategoryAction";
import { FaTrash } from "react-icons/fa";

interface DeleteCategoryProps {
  category: CategoryItem;
  btnColor?: string;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ category, btnColor="btn-danger" }) => {
  const router = useRouter();

  const handleConfirmDelete = async () => {
    console.log("Deleting category", category);
    await deleteCategoryAction(category.id);
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
