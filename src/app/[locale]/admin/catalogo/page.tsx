import Loader from "@/lib/components/Loader";
import CreateCatalogue from "@/modules/catalogue/components/CreateCatalogue";
import ProductList from "@/modules/catalogue/components/ProductList";
import React, { Suspense } from "react";
import { CategoryRepository } from "@/modules/category/definitions";
import { RegionRepository } from "@/modules/region/definitions";

const CatalogoPage: React.FC = async () => {
  const allCategories = await new CategoryRepository().getAll();
  const regions = await new RegionRepository().getAll();
  return (
    <>
      <Suspense fallback={<Loader />}>
        <div className="flex items-center justify-end border-b pb-2 mb-4">
          <CreateCatalogue allCategories={allCategories} regions={regions} />
        </div>
        <ProductList />
      </Suspense>
    </>
  );
};

export default CatalogoPage;
