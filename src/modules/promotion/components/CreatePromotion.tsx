"use client";
import ModalGeneric from "@/lib/components/ModalGeneric";
import PromotionForm, { FormPromotionsValues } from "./PromotionForm";
import { useState } from "react";
import { createPromotionAction } from "../actions/createPromotionAction";
import { updatePromotionAction } from "../actions/updatePromotionAction";

const CreatePromotion = () => {
  const initialValues: FormPromotionsValues = {
    code: "",
    name: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    active: false,
  };

  const [formState, setFormState] = useState<FormPromotionsValues>({
    code: "",
    name: "",
    description: "",
    discount: 0,
    startDate: "",
    endDate: "",
    active: false,
  });

  const handleValuesChange = (values: FormPromotionsValues) => {
    setFormState(values);
  };

  const handleSubmit = async (close: () => void) => {
    try {
      const submissionData = {
        ...formState,
        code: formState.code ? formState.code : '',
        startDate: formState.startDate ? new Date(formState.startDate) : new Date(),
        endDate: formState.endDate ? new Date(formState.endDate) : new Date(),
        regionId: null,
      };
      await createPromotionAction(submissionData);
      close();
    } catch (error: any) {
      console.error("Error al procesar la solicitud");
      
    }
  };

  return (
    <>
      <ModalGeneric
        title="Agregar producto"
        triggerBtnTitle="Agregar"
        actionBtnText="Guardar"
        actionBtnFunction={handleSubmit}
        cancelBtnText="Cancelar"
        cancelBtnFunction={() => console.log("click action cancel")}
      >
        <PromotionForm initialValues={initialValues} onValuesChange={handleValuesChange} />
      </ModalGeneric>
    </>
  );
};

export default CreatePromotion;
