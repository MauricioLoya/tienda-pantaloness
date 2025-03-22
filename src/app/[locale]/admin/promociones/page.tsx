import Loader from "@/lib/components/Loader";
import CreatePromotion from "@/modules/promotion/components/CreatePromotion";
import PromotionList from "@/modules/promotion/components/PromotionList";
import React, { Suspense } from "react";
import { RegionRepository } from "@/modules/region/definitions";

const PromotionPage: React.FC = async () => {
  const regions = await new RegionRepository().getAll();
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="flex items-center justify-end border-b pb-2 mb-4">
          <CreatePromotion regions={regions} />
        </div>
        <PromotionList />
      </Suspense>
    </>
  );
};

export default PromotionPage;
