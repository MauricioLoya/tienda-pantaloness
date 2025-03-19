'use client';

import React from "react";
import ModalGeneric from "./ModalGeneric";

export interface ConfirmModalProps {
  title: string;
  message: string;
  triggerBtnTitle: string;
  confirmBtnText: string;
  cancelBtnText: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  fullScreen?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  triggerBtnTitle,
  confirmBtnText,
  cancelBtnText,
  onConfirm,
  onCancel,
  fullScreen = false,
}) => {
  const handleConfirm = async (close: () => void) => {
    try {
      await onConfirm();
      close();
    } catch (error: any) {
      alert(error.message || "Error en la confirmación");
    }
  };

  return (
    <ModalGeneric
      title={title}
      triggerBtnTitle={triggerBtnTitle}
      actionBtnText={confirmBtnText}
      cancelBtnText={cancelBtnText}
      actionBtnFunction={(close) => handleConfirm(close)}
      cancelBtnFunction={onCancel}
      fullScreen={fullScreen}
    >
      <div className="py-4">
        <p className="text-base text-gray-700">{message}</p>
      </div>
    </ModalGeneric>
  );
};

export default ConfirmModal;
