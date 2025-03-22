"use client";
import ModalGeneric from "@/lib/components/ModalGeneric";
import PromotionForm, {
  FormPromotionsValues,
} from "./PromotionForm";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RegionItem } from "@/modules/region/definitions";
import { CreatePromotionAction } from "../actions/createPromotionAction";
import { PromotionFormHandle } from "./PromotionForm";

const CreatePromotion = ({ regions }: { regions: RegionItem[] }) => {
  const router = useRouter();
  const formRef = useRef<PromotionFormHandle>(null);

  const initialValues: FormPromotionsValues = {
    code: "",
    name: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    active: false,
    regionId: "",
  };

  const [formState, setFormState] =
    useState<FormPromotionsValues>(initialValues);

  const handleValuesChange = (values: FormPromotionsValues) => {
    setFormState(values);
  };

  const handleSubmit = async (close: () => void) => {
    if (formRef.current) {
      try {
        const validValues = await formRef.current.submit();
        const submissionData = {
          ...validValues,
          startDate: validValues.startDate
            ? new Date(validValues.startDate)
            : new Date(),
          endDate: validValues.endDate
            ? new Date(validValues.endDate)
            : new Date(),
        };
        await CreatePromotionAction(submissionData);
        close();
        router.refresh();
      } catch (errors) {
        alert("Por favor, corrige los errores en el formulario.");
      }
    }
  };

  return (
    <>
      <ModalGeneric
        title="Agregar promoción"
        triggerBtnTitle="Agregar"
        actionBtnText="Guardar"
        actionBtnFunction={handleSubmit}
        cancelBtnText="Cancelar"
        cancelBtnFunction={() => console.log("click action cancel")}
      >
        <PromotionForm
          ref={formRef}
          initialValues={initialValues}
          onValuesChange={handleValuesChange}
          regions={regions}
        />
      </ModalGeneric>
    </>
  );
};

export default CreatePromotion;