"use client";

import React from "react";
import ModalGeneric from "@/lib/components/ModalGeneric";
import CategoryForm from "./CategoryForm";
import { CategoryItem } from "../definitions";
import { RegionItem } from "@/modules/region/definitions";
import { useRouter } from "next/navigation";
import { updateCategoryAction } from "../action/updateCategoryAction";
interface UpdateCategoryModalProps {
  category: CategoryItem;
  regions: RegionItem[];
}

const UpdateCategoryModal: React.FC<UpdateCategoryModalProps> = ({
  category,
  regions,
}) => {
  const router = useRouter();
  const updatedCategory = category;

  const handleValuesChange = (values: any) => {
    updatedCategory.name = values.name;
    updatedCategory.description = values.description;
    updatedCategory.regionId = values.regionId;
  };

  const handleSubmit = async (close: () => void) => {
    try {
      await updateCategoryAction(updatedCategory);
      router.refresh();
      close();
    } catch (error: any) {
      alert(error.message || "Error al crear la categoría");
    }
  };

  return (
    <ModalGeneric
      title={`Actualizar Categoría`}
      triggerBtnTitle="Actualizar Categoría"
      actionBtnText="Actualizar Cambios"
      cancelBtnText="Cancelar"
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log("Cancelar")}
      fullScreen={false}
    >
      <CategoryForm
        onValuesChange={handleValuesChange}
        initialData={category}
        regions={regions}
      />
    </ModalGeneric>
  );
};

export default UpdateCategoryModal;
