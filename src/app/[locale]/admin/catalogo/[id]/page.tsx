import React from "react";
import { ProductRepository } from "@/modules/catalogue/definitions";
import BasicForm from "@/modules/catalogue/components/BasicForm";
import ImagesForm from "@/modules/catalogue/components/ImagesForm";
import CategoriesForm from "@/modules/catalogue/components/CategoriesForm";
import VariantsForm from "@/modules/catalogue/components/VariantsForm";
import { CategoryRepository } from "@/modules/category/definitions";
import { RegionItem, RegionRepository } from "@/modules/region/definitions";
import { notFound } from "next/navigation";
import HeaderContent from "@/lib/components/HeaderContent";
import ProductDetails from "@/modules/catalogue/components/ProductDetail";

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
    active: productDetail.product.active,
    regionId: productDetail.product.regionId ?? undefined,
    slug: productDetail.product.slug ?? undefined,
  };

  return (
    <>
      <HeaderContent
        title={`Editar ${productDetail.product.name}`}
        href="./"
        action=""
      />
      <ProductDetails productProp={productDetail} />
    </>
  );
}
