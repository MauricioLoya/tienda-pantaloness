import { PromotionRepository } from "@/modules/promotion/definitions";
import React from "react";
import PromotionDetails from "@/modules/promotion/components/PromotionDetails";
type Props = {
  params: { id: string };
};

const PromotionDetailsPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  const promotionRepo = new PromotionRepository();
  const promotion = await promotionRepo.getById(Number(id));
  if (!promotion) {
    return <div>Promoción no encontrada</div>;
  }

  return (
    <>
      <PromotionDetails promotion={promotion} />
    </>
  );
};

export default PromotionDetailsPage;
