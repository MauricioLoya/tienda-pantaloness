"use client";
import ModalGeneric from "@/lib/components/ModalGeneric";
import React from "react";

const CreateOrden = () => {
  return (
    <>
      <ModalGeneric
        title="Agregar orden"
        triggerBtnTitle="Agregar"
        actionBtnText="Guardar"
        actionBtnFunction={(close) => {
          console.log("click action save");
          setTimeout(() => {
            close();
          }, 500);
        }}
        cancelBtnText="Cancelar"
        cancelBtnFunction={() => console.log("click action cancel")}
      >
        <div>CONTENT</div>
      </ModalGeneric>
    </>
  );
};

export default CreateOrden;
