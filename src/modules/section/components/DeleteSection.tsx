'use client';

import React from "react";
import ConfirmModal from "@/lib/components/ConfirmModal";
import {  SectionItem } from "../definitions";
import { useRouter } from "next/navigation";
import { FaTrash } from "react-icons/fa";
import { useToast } from '@/lib/components/ToastContext';
import { deleteSectionAction } from "../actions/deleteSectionAction";

interface DeleteSectionProps {
  section: SectionItem;
  btnColor?: string;
}

const DeleteSection: React.FC<DeleteSectionProps> = ({ section, btnColor="btn-danger" }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmDelete = async () => {
    await deleteSectionAction(section.id);
    showToast("Sección eliminada correctamente", "success");
    router.refresh();
  };

  return (
    <ConfirmModal
      title="Eliminar Sección"
      message={`¿Estás seguro de eliminar la sección "${section.title}"?`}
      triggerBtnTitle="Eliminar"
      triggerBtnContent={<FaTrash />}
      confirmBtnText="Sí, eliminar"
      cancelBtnText="Cancelar"
      onConfirm={handleConfirmDelete}
    />
  );
};

export default DeleteSection;
