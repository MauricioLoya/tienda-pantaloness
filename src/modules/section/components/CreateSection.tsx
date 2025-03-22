"use client";

import React, { useState } from "react";
import ModalGeneric from "@/lib/components/ModalGeneric";
import SectionForm, { SectionInput } from "./SectionForm";
import { RegionItem } from "@/modules/region/definitions";
import { useRouter } from "next/navigation";
import { createSectionAction } from "../actions/createSectionAction";
import { SectionType } from "@prisma/client";

interface CreateSectionProps {
  regions: RegionItem[];
}

const CreateSection: React.FC<CreateSectionProps> = ({ regions }) => {
  const router = useRouter();
  const [formValues, setFormValues] = useState<SectionInput>({
    type: SectionType.banner,
    title: "",
    description: "",
    regionId: "",
    actionUrl: "",
    order: 1,
    backgroundUrl: "",
    backgroundColor: "#063d79",
  });

  const handleSubmit = async (close: () => void) => {
    try {
      await createSectionAction(formValues);
      close();
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Error al crear la sección");
    }
  };

  return (
    <ModalGeneric
      title="Crear Sección"
      triggerBtnTitle="Agregar Sección"
      actionBtnText="Guardar"
      cancelBtnText="Cancelar"
      actionBtnFunction={(close) => handleSubmit(close)}
      cancelBtnFunction={() => {}}
      fullScreen={false}
    >
      <SectionForm
        onValuesChange={(values) => setFormValues(values)}
        regions={regions}
      />
    </ModalGeneric>
  );
};

export default CreateSection;
