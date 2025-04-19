import React, { useRef } from 'react';

export interface ModalCreateProps {
  title: string;
  triggerBtnTitle: string;
  triggerBtnContent?: React.ReactNode;
  children: React.ReactNode | ((closeModal: () => void) => React.ReactNode);
  fullScreen?: boolean;
}

const ModalGeneric: React.FC<ModalCreateProps> = props => {
  const {
    title,
    triggerBtnTitle,
    triggerBtnContent,
    children,
    fullScreen,
  } = props;

  const modalRef = useRef<HTMLDialogElement>(null);

  const close = () => {
    modalRef.current?.close();
  };

  const modalBoxClasses = fullScreen
    ? 'modal-box w-full h-full max-w-full p-6'
    : 'modal-box w-12/12 max-w-5xl';

  return (
    <>
      <button
        className={`btn btn-active btn-primary`}
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
          <div className='flex items-center justify-between relative'>
            <h1 className='font-bold text-xl mb-6'>{title}</h1>
            <button
              className='btn btn-sm btn-circle absolute right-2 top-2'
              onClick={close}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {typeof children === 'function' ? children(close) : children}
        </div>
      </dialog>
    </>
  );
};

export default ModalGeneric;