"use client";
import React from "react";
import ConfirmModal from "@/lib/components/ConfirmModal";
import { PromotionItem } from "../definitions";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { useToast } from "@/lib/components/ToastContext";
import { DeletePromotionAction } from "../actions/deletePromotionAction";

interface DeletePromotionProps {
  promotion: PromotionItem;
  btnColor?: string;
}

const DeletePromotion: React.FC<DeletePromotionProps> = ({
  promotion,
  btnColor = "btn-danger",
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    try {
      await DeletePromotionAction(promotion.id);
      showToast("Promoción eliminada correctamente", "success");
      router.refresh();
    } catch (error: any) {
      showToast("Error al eliminar la promoción", "error");
    }
  };

  return (
    <ConfirmModal
      title="Eliminar Promoción"
      message={`¿Estás seguro de eliminar la promoción "${promotion.name}"?`}
      triggerBtnTitle="Eliminar"
      triggerBtnContent={<FaTrash />}
      confirmBtnText="Sí, eliminar"
      cancelBtnText="Cancelar"
      onConfirm={handleConfirmDelete}
      btnColor={btnColor}
    />
  );
};

export default DeletePromotion;
