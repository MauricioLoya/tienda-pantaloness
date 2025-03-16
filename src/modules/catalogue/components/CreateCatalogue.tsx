'use client'
import ModalGeneric from "@/lib/components/ModalGeneric";
import React from "react";
import VariantsForm from "./VariantsForm";
import CategoriesForm from "./CategoriesForm";
import ImagesForm from "./ImagesForm";
import BasicForm from "./BasicForm";
import { CategoryItem } from "../definitions";

const CreateCatalogue = ({allCategories} : {allCategories: CategoryItem[]}) => {
  return (
    <>
      <ModalGeneric
        title="Agregar producto"
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
        <>
          <div className="flex justify-center mx-auto p-6">
            <div className="flex flex-initial">
              <BasicForm mode="create" />
            </div>
            <div className="flex flex-col flex-2">
              <ImagesForm />
              <CategoriesForm allCategories={allCategories} />
            </div>
          </div>
          <VariantsForm />
        </>
      </ModalGeneric>
    </>
  );
};

export default CreateCatalogue;
