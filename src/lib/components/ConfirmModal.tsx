'use client';

import React, { useRef } from 'react';

export interface ModalCreateProps {
  title: string;
  triggerBtnTitle: string;
  triggerBtnContent?: React.ReactNode;
  children: React.ReactNode;
  actionBtnText: string;
  cancelBtnText: string;
  btnColor?: string;
  actionBtnFunction: (close: () => void) => void;
  cancelBtnFunction?: () => void;
  fullScreen?: boolean;
}

const ModalGeneric2: React.FC<ModalCreateProps> = props => {
  const {
    title,
    triggerBtnTitle,
    triggerBtnContent,
    children,
    actionBtnText,
    cancelBtnText,
    btnColor = 'btn-primary',
    actionBtnFunction,
    cancelBtnFunction,
    fullScreen,
  } = props;

  const modalRef = useRef<HTMLDialogElement>(null);

  const close = () => {
    modalRef.current?.close();
  };

  const cancel = () => {
    if (cancelBtnFunction) {
      cancelBtnFunction();
    }
    close();
  };

  const modalBoxClasses = fullScreen
    ? 'modal-box w-full h-full max-w-full p-6'
    : 'modal-box w-12/12 max-w-5xl';

  return (
    <>
      <button
        className={`btn btn-active ${btnColor}`}
        data-backdrop='static'
        onClick={() => modalRef?.current?.showModal()}
      >
        <div className='flex items-center gap-2'>
          {triggerBtnContent}
          {triggerBtnTitle}
        </div>
      </button>
      <dialog id='my_modal_4' ref={modalRef} className='modal'>
        <div className={modalBoxClasses}>
          <h1 className='font-bold text-xl mb-6'>{title}</h1>
          {children}
          <div className='modal-action'>
            <button className='btn mr-4' onClick={() => cancel()}>
              {cancelBtnText}
            </button>
            <button className='btn btn-primary' onClick={() => actionBtnFunction(close)}>
              {actionBtnText}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};


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
    <ModalGeneric2
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
    </ModalGeneric2>
  );
};






export default ConfirmModal;
