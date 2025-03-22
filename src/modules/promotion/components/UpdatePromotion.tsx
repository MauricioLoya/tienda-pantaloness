"use client";
import React, { useState } from "react";
import ModalGeneric from "@/lib/components/ModalGeneric";
import PromotionForm, { FormPromotionsValues } from "./PromotionForm";
import { PromotionItem } from "../definitions";
import { useRouter } from "next/navigation";
import { UpdatePromotionAction } from "../actions/updatePromotionAction";
import { FaEdit } from "react-icons/fa";
import { useToast } from "@/lib/components/ToastContext";
import { RegionItem } from "@/modules/region/definitions";

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

  const [formState, setFormState] = useState<FormPromotionsValues>({
    code: promotion.code,
    name: promotion.name,
    description: promotion.description,
    discount: promotion.discount,
    startDate: promotion.startDate.toISOString().substring(0, 10),
    endDate: promotion.endDate.toISOString().substring(0, 10),
    active: promotion.active,
    regionId: promotion.regionId,
  });

  const handleValuesChange = (values: FormPromotionsValues) => {
    setFormState(values);
  };

  const handleSubmit = async (close: () => void) => {
    try {
      await UpdatePromotionAction(promotion.id, formState);
      router.refresh();
      showToast("Promoción actualizada correctamente", "success");
      close();
    } catch (error: any) {
      showToast("Error al actualizar la promoción", "error");
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
        initialValues={formState}
        onValuesChange={handleValuesChange}
        regions={regions}
      />
    </ModalGeneric>
  );
};

export default UpdatePromotion;
