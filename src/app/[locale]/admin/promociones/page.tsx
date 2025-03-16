import Loader from "@/lib/components/Loader";
import CreatePromotion from "@/modules/promotion/components/CreatePromotion";
import PromotionList from "@/modules/promotion/components/PromotionList";
import React, { Suspense } from "react";

const PromotionPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <CreatePromotion />
        <PromotionList />
      </Suspense>
    </>
  );
};

export default PromotionPage;
