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
    console.log("Estado actualizado en el padre:", values);
  };

  const handleSubmit = async (close: () => void) => {
    try {
      const submissionData = {
        ...formState,
        code: formState.code ? formState.code : '',
        startDate: formState.startDate ? new Date(formState.startDate) : new Date(),
        endDate: formState.endDate ? new Date(formState.endDate) : new Date(),
      };
      // if (mode === "create") {
      await createPromotionAction(submissionData);
      // } else if (mode === "update") {
      //   if (!id) throw new Error("ID no proporcionado");
      //   await updatePromotionAction(Number(id), submissionData);
      // }
      close();
    } catch (error: any) {
      // setStatus(error.message || "Error al procesar la solicitud");
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
