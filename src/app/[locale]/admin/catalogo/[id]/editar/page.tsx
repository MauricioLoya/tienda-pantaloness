import React from "react";
import { ProductRepository } from "@/modules/catalogue/definitions";
import BasicForm from "@/modules/catalogue/components/BasicForm";
import ImagesForm from "@/modules/catalogue/components/ImagesForm";
import CategoriesForm from "@/modules/catalogue/components/CategoriesForm";
import VariantsForm from "@/modules/catalogue/components/VariantsForm";
import { CategoryRepository } from "@/modules/category/definitions";
import { RegionItem, RegionRepository } from '@/modules/region/definitions'
import { notFound } from "next/navigation";
import HeaderContent from "@/lib/components/HeaderContent";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  const productRepo = new ProductRepository();
  const productDetail = await productRepo.getProductById(productId);
  const regions: RegionItem[] = await new RegionRepository().getAll();

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
    regionId: productDetail.product.regionId ?? undefined,
    slug: productDetail.product.slug ?? undefined,
  };

  return (
    <>
      <HeaderContent title={`Editar ${productDetail.product.name}`} href="./" />
      <div className="flex justify-center mx-auto p-6">
        <div className="flex flex-initial">
          <BasicForm productId={productId} initialData={basicData} regions={regions} />
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
