import React, { useRef } from "react";
import { ModalCreateProps } from "../types";

const ModalGeneric = (props: ModalCreateProps) => {
  const {
    title,
    triggerBtnTitle,
    children,
    actionBtnText,
    cancelBtnText,
    actionBtnFunction,
    cancelBtnFunction,
    fullScreen,
  } = props;
  const modalRef = useRef<HTMLDialogElement>(null);

  const close = () => {
    modalRef.current?.close();
  };

  const cancel = () => {
    cancelBtnFunction && cancelBtnFunction();
    close();
  };
  const modalBoxClasses = fullScreen
    ? "modal-box w-full h-full max-w-full p-6"
    : "modal-box w-12/12 max-w-5xl";

  return (
    <div className="flex justify-end items-center mb-4">
      <button
        className="btn btn-active btn-primary"
        data-backdrop="static"
        onClick={() => modalRef?.current?.showModal()}
      >
        {triggerBtnTitle}
      </button>
      <dialog id="my_modal_4" ref={modalRef} className="modal">
        <div className={modalBoxClasses}>
          <h1 className="font-bold text-xl mb-6">{title}</h1>
          {children}
          <div className="modal-action">
            <button className="btn mr-4" onClick={() => cancel()}>
              {cancelBtnText}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => actionBtnFunction(close)}
            >
              {actionBtnText}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ModalGeneric;
