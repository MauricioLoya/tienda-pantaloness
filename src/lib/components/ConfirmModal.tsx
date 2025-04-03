'use client';

import React from 'react';
import ModalGeneric from './ModalGeneric';

export interface ConfirmModalProps {
  title: string;
  message: string;
  triggerBtnTitle: string;
  triggerBtnContent?: React.ReactNode;
  confirmBtnText: string;
  cancelBtnText: string;
  btnColor?: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
  fullScreen?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  triggerBtnTitle,
  triggerBtnContent,
  confirmBtnText,
  cancelBtnText,
  btnColor,
  onConfirm,
  onCancel,
  fullScreen = false,
}) => {
  const handleConfirm = async (close: () => void) => {
    try {
      await onConfirm();
      close();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || 'Error en la confirmación');
      } else {
      alert("Error desconocido en la confirmación");
    }
    }
  };

  return (
    <ModalGeneric
      title={title}
      triggerBtnContent={triggerBtnContent}
      triggerBtnTitle={triggerBtnTitle}
      actionBtnText={confirmBtnText}
      cancelBtnText={cancelBtnText}
      btnColor={btnColor}
      actionBtnFunction={close => handleConfirm(close)}
      cancelBtnFunction={onCancel}
      fullScreen={fullScreen}
    >
      <div className='py-4'>
        <p className='text-base text-gray-700'>{message}</p>
      </div>
    </ModalGeneric>
  );
};

export default ConfirmModal;
