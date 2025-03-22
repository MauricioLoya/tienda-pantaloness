"use client";
import React, { useState, useRef } from "react";
import ModalGeneric from "@/lib/components/ModalGeneric";
import PromotionForm, { FormPromotionsValues } from "./PromotionForm";
import { PromotionItem } from "../definitions";
import { useRouter } from "next/navigation";
import { UpdatePromotionAction } from "../actions/updatePromotionAction";
import { FaEdit } from "react-icons/fa";
import { useToast } from "@/lib/components/ToastContext";
import { RegionItem } from "@/modules/region/definitions";
import { PromotionFormHandle } from "./PromotionForm";

interface UpdatePromotionProps {
  promotion: PromotionItem;
  regions: RegionItem[];
}

const UpdatePromotion: React.FC<UpdatePromotionProps> = ({
  promotion,
  regions,
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<PromotionFormHandle>(null);

  const initialValues: FormPromotionsValues = {
    code: promotion.code,
    name: promotion.name,
    description: promotion.description,
    discount: promotion.discount,
    startDate: promotion.startDate.toISOString().substring(0, 10),
    endDate: promotion.endDate.toISOString().substring(0, 10),
    active: promotion.active,
    regionId: promotion.regionId,
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
        await UpdatePromotionAction(promotion.id, validValues);
        router.refresh();
        showToast("Promoción actualizada correctamente", "success");
        close();
      } catch (errors) {
        showToast("Por favor, corrige los errores en el formulario.", "error");
      }
    }
  };

  return (
    <ModalGeneric
      title="Actualizar Promoción"
      triggerBtnTitle="Actualizar"
      triggerBtnContent={<FaEdit />}
      actionBtnText="Actualizar Cambios"
      cancelBtnText="Cancelar"
      actionBtnFunction={handleSubmit}
      cancelBtnFunction={() => console.log("Cancelar")}
    >
      <PromotionForm
        ref={formRef}
        initialValues={formState}
        onValuesChange={handleValuesChange}
        regions={regions}
      />
    </ModalGeneric>
  );
};

export default UpdatePromotion;