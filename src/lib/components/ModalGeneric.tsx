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

const ModalGeneric: React.FC<ModalCreateProps> = props => {
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

export default ModalGeneric;
