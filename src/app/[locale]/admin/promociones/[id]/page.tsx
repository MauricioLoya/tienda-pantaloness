import { PromotionRepository } from "@/modules/promotion/definitions";
import React from "react";
import PromotionDetails from "@/modules/promotion/components/PromotionDetails";
import HeaderContent from "@/lib/components/HeaderContent";
import { RegionRepository } from "@/modules/region/definitions";
import UpdatePromotion from "@/modules/promotion/components/UpdatePromotion";
import ActivatePromotion from "@/modules/promotion/components/ActivatePromotion";
import DeletePromotion from "@/modules/promotion/components/DeletePromotion";
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
  const actions = (
    <>
      <UpdatePromotion
        promotion={promotion}
        regions={await new RegionRepository().getAll()}
      />
      {promotion.isDeleted ? (
        <ActivatePromotion promotion={promotion} />
      ) : (
        <DeletePromotion promotion={promotion} />
      )}
    </>
  );
  return (
    <>
      <HeaderContent
        title={`Detalle de ${promotion.name}`}
        href="./"
        action={actions}
      />
      <PromotionDetails promotion={promotion} />
    </>
  );
};

export default PromotionDetailsPage;
