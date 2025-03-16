import React from "react";
import { PromotionRepository } from "../definitions";
import PromotionTable from "./PromotionTable";
import PromotionAddButton from "./PromotionAddButton";

const PromotionList: React.FC = async () => {
  const promotionRepo = new PromotionRepository();
  const promotions = await promotionRepo.getAll();

  return (
    <div className="p-4">
      <PromotionTable values={promotions} />
    </div>
  );
};

export default PromotionList;
