import React from "react";
import { PromotionRepository } from "../definitions";
import PromotionTable from "./PromotionTable";
import PromotionAddButton from './PromotionAddButton'

const PromotionList: React.FC = async () => {
  const promotionRepo = new PromotionRepository();
  const promotions = await promotionRepo.getAll();

  return (
    <>
      <div className="flex justify-end items-center mb-4">
        <PromotionAddButton />
      </div>
      <PromotionTable values={promotions} />
    </>
  );
};

export default PromotionList;
