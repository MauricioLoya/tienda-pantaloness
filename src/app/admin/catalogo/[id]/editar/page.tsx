import React from "react";
import { ProductRepository } from "@/modules/catalogue/definitions";
import ProductForm from '@/modules/catalogue/components/ProductForm'

type Props = {
  params: { id: string };
};

const UpdateProductPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params
  const productRepo = new ProductRepository();
  const productDetail = await productRepo.getProductById(Number(id));

  if (!productDetail) {
    return <div>Producto no encontrado</div>;
  }

  const initialData = {
    name: productDetail.product.name,
    description: productDetail.product.description,
    basePrice: productDetail.product.basePrice,
    active: productDetail.product.active,
    images: productDetail.images,
    categories: productDetail.categories,
    variants: productDetail.variants     
  }

  return <ProductForm mode="update" id={id} initialData={initialData} />
};

export default UpdateProductPage;
