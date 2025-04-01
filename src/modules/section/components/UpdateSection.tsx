"use client";

import React, { useState } from "react";
import ModalGeneric from "@/lib/components/ModalGeneric";
import SectionForm, { SectionInput } from "./SectionForm";
import { HighlightProductItem, SectionItem, SectionRepository } from "../definitions";
import { RegionItem } from "@/modules/region/definitions";
import { useRouter } from "next/navigation";
import { updateSectionAction } from "../actions/updateSectionAction";
import { FaEdit } from "react-icons/fa";
import { useToast } from "@/lib/components/ToastContext";
import {
  ProductItem,
} from "@/modules/catalogue/definitions";

interface UpdateSectionProps {
  section: SectionItem;
  regions: RegionItem[];
  availableProducts: HighlightProductItem[];
}

const UpdateSection: React.FC<UpdateSectionProps> = ({
  section,
  regions,
  availableProducts,
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [updatedSection, setUpdatedSection] = useState<SectionItem>({
    ...section,
  });
  const DefaultColors = {
    buttonText: "#063d79",
    buttonColor: "#000000",
  };
  const handleValuesChange = (values: SectionInput) => {
    console.log(values)
    updatedSection.type = values.type;
    updatedSection.title = values.title;
    updatedSection.description = values.description;
    updatedSection.regionId = values.regionId;
    updatedSection.actionUrl = values.actionUrl;
    updatedSection.order = values.order;
    updatedSection.backgroundUrl = values.backgroundUrl;
    updatedSection.backgroundColor = values.backgroundColor;
    if ("highlightProductIds" in values){
      console.log("hay: ", values.highlightProductIds?.length)
      updatedSection.highlightProducts = values.highlightProductIds
    }
    if ("buttonText" in values) {
      updatedSection.buttonText = values.buttonText ?? DefaultColors.buttonText
    }
    if ("buttonColor" in values) {
      updatedSection.buttonColor =
        values.buttonColor ?? DefaultColors.buttonColor;
    }
  };

  const handleSubmit = async (close: () => void) => {
    try {
      console.log(updatedSection);
      
      await updateSectionAction(updatedSection.id, updatedSection);
      router.refresh();
      showToast("Sección actualizada correctamente", "success");
      close();
    } catch (error: any) {
      showToast("Error al actualizar la sección", "error");
      console.error(error);
    }
  };

  return (
    <ModalGeneric
      title="Actualizar Sección"
      triggerBtnTitle="Actualizar"
      triggerBtnContent={<FaEdit />}
      actionBtnText="Actualizar Cambios"
      cancelBtnText="Cancelar"
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log("Cancelar")}
      fullScreen={false}
    >
      <SectionForm
        onValuesChange={handleValuesChange}
        initialData={updatedSection}
        regions={regions}
        availableProducts={availableProducts}
      />
    </ModalGeneric>
  );
};

export default UpdateSection;
