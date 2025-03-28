import React from "react";
import { ProductRepository } from "../definitions";
import ProductTable from "./ProductTable";
import { RegionRepository } from "@/modules/region/definitions";

const ProductList: React.FC = async () => {
  const promotionRepo = new ProductRepository();
  const products = await promotionRepo.getProducts();

  return (
    <div className="p-4">
      <ProductTable
        values={products}
        regions={await new RegionRepository().getAll()}
      />
    </div>
  );
};

export default ProductList;
