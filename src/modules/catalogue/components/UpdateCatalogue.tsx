'use client'
import ModalGeneric from "@/lib/components/ModalGeneric";
import React from "react";
import VariantsForm from "./VariantsForm";
import CategoriesForm from "./CategoriesForm";
import ImagesForm from "./ImagesForm";
import BasicForm from "./BasicForm";
import { RegionItem } from '@/modules/region/definitions'
import { ProductDetail } from "../definitions";
import { useRouter } from "next/router";
import { useToast } from "@/lib/components/ToastContext";


interface UpdateCatalogueProps {
  product: ProductDetail;
  regions: RegionItem[];
}

const UpdateCatalogue: React.FC<UpdateCatalogueProps> = ({ product, regions }) => {
  const router = useRouter();
  const [updatedProduct, setUpdatedProduct] = React.useState<ProductDetail>(product);
  const { showToast } = useToast();
  
  // const handleSubmit = async (close: () => void) => {
  //     try {
  //       await UpdateCatalogueAction(updatedCategory);
  //       router.refresh();
  //       showToast("Categoría actualizada correctamente", "success");
  //       close();
  //     } catch (error: any) {
  //       showToast ("Error al crear la categoría", "error");
  //       console.error(error);
  //     }
  //   };
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
              <BasicForm regions={regions}/>
            </div>
            <div className="flex flex-col flex-2">
              <ImagesForm />
              {/* <CategoriesForm allCategories={allCategories} /> */}
            </div>
          </div>
          <VariantsForm />
        </>
      </ModalGeneric>
    </>
  );
};

export default UpdateCatalogue;
