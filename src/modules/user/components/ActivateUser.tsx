"use client";
import React from "react";
import ConfirmModal from "@/lib/components/ConfirmModal";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
import { useToast } from "@/lib/components/ToastContext";
import { UserItem } from "../definitions";
import { ActivateUserAction } from "../actions/activateUserAction";

interface ActivateUserProps {
  user: UserItem;
  btnColor?: string;
}

const ActivateUser: React.FC<ActivateUserProps> = ({
  user,
  btnColor = "btn-success",
}) => {
  const router = useRouter();
  const { showToast } = useToast();

  const handleConfirmActivate = async () => {
    try {
      await ActivateUserAction(user.id);
      showToast("Usuario activado correctamente", "success");
      router.refresh();
    } catch (error: any) {
      showToast("Error al activar el usuario", "error");
    }
  };

  return (
    <ConfirmModal
      title="Activar Usuario"
      message={`¿Estás seguro de activar al usuario "${user.name}"?`}
      triggerBtnTitle="Activar"
      triggerBtnContent={<FaCheckCircle />}
      confirmBtnText="Sí, activar"
      cancelBtnText="Cancelar"
      onConfirm={handleConfirmActivate}
      btnColor={btnColor}
    />
  );
};

export default ActivateUser;
