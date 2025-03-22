"use client";
import ModalGeneric from "@/lib/components/ModalGeneric";
import PromotionForm, {
  FormPromotionsValues,
  PromotionSchema,
} from "./PromotionForm";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegionItem } from "@/modules/region/definitions";
import { CreatePromotionAction } from "../actions/createPromotionAction";

const CreatePromotion = ({ regions }: { regions: RegionItem[] }) => {
  const router = useRouter();

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
    try {
      await PromotionSchema.validate(formState);
      const submissionData = {
        ...formState,
        startDate: formState.startDate
          ? new Date(formState.startDate)
          : new Date(),
        endDate: formState.endDate ? new Date(formState.endDate) : new Date(),
      };
      await CreatePromotionAction(submissionData);
      close();
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Error al crear la promoción");
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
          initialValues={initialValues}
          onValuesChange={handleValuesChange}
          regions={regions}
        />
      </ModalGeneric>
    </>
  );
};

export default CreatePromotion;
