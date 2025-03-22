import Loader from "@/lib/components/Loader";
import React, { Suspense } from "react";
import { CategoryRepository } from "@/modules/category/definitions";
import { RegionRepository } from "@/modules/region/definitions";
import SectionList from "@/modules/section/components/SectionList";
import CreateSection from "@/modules/section/components/CreateSection";

const SectionPage: React.FC = async () => {
  const regions = await new RegionRepository().getAll();
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="flex items-center justify-end border-b pb-2 mb-4">
          <CreateSection regions={regions} />
        </div>
        <SectionList />
      </Suspense>
    </>
  );
};

export default SectionPage;
