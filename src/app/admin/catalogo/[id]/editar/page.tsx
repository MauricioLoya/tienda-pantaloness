import React from "react";
import { ProductRepository } from "@/modules/catalogue/definitions";
import BasicForm from "@/modules/catalogue/components/BasicForm";
import ImagesForm from "@/modules/catalogue/components/ImagesForm";
import CategoriesForm from "@/modules/catalogue/components/CategoriesForm";
import VariantsForm from "@/modules/catalogue/components/VariantsForm";
import { CategoryRepository } from "@/modules/category/definitions";

type Props = {
  params: { id: string };
};

export default async function UpdateProductPage({ params }: Props) {
  const productId = await Number(params.id);
  const productRepo = new ProductRepository();
  const productDetail = await productRepo.getProductById(productId);

  const catRepo = new CategoryRepository();
  const allCategories = await catRepo.getAll();

  if (!productDetail) {
    return <div>Producto no encontrado</div>;
  }

  const basicData = {
    name: productDetail.product.name,
    description: productDetail.product.description,
    basePrice: productDetail.product.basePrice,
    active: productDetail.product.active,
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-2 gap-4">
      <BasicForm productId={productId} initialData={basicData} />

      <ImagesForm productId={productId} images={productDetail.images} />

      <CategoriesForm
        productId={productId}
        categories={productDetail.categories}
        allCategories={allCategories}
      />

      <VariantsForm productId={productId} variants={productDetail.variants} />
    </div>
  );
}
