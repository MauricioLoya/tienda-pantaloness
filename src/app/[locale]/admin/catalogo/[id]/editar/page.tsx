import React from "react";
import { ProductRepository } from "@/modules/catalogue/definitions";
import BasicForm from "@/modules/catalogue/components/BasicForm";
import ImagesForm from "@/modules/catalogue/components/ImagesForm";
import CarouselImagesForm from "@/modules/catalogue/components/CarouselImagesForm";
import CategoriesForm from "@/modules/catalogue/components/CategoriesForm";
import VariantsForm from "@/modules/catalogue/components/VariantsForm";
import { CategoryRepository } from "@/modules/category/definitions";
import { notFound } from "next/navigation";
import HeaderContent from "@/lib/components/HeaderContent";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProductPage({ params }: Props) {
  const { id } = await params;
  const productId = await Number(id);
  const productRepo = new ProductRepository();
  const productDetail = await productRepo.getProductById(productId);

  const catRepo = new CategoryRepository();
  const allCategories = await catRepo.getAll();

  if (!productDetail) {
    return notFound();
  }

  const basicData = {
    name: productDetail.product.name,
    description: productDetail.product.description,
    basePrice: productDetail.product.basePrice,
    active: productDetail.product.active,
  };

  return (
    <>
      <HeaderContent title={`Editar ${productDetail.product.name}`} href="./" />
      <div className="flex justify-center mx-auto p-6">
        <div className="flex flex-initial">
          <BasicForm productId={productId} initialData={basicData} />
        </div>
        <div className="flex flex-col flex-2">
          <ImagesForm productId={productId} images={productDetail.images} />
          <CategoriesForm
            productId={productId}
            categories={productDetail.categories}
            allCategories={allCategories}
          />
        </div>
      </div>
      <VariantsForm productId={productId} variants={productDetail.variants} />
    </>
  );
}
