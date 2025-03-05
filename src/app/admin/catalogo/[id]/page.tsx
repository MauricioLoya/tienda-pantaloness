import React from "react";
import ProductDetail from "@/modules/catalogue/components/ProductDetail";
import { ProductRepository } from "@/modules/catalogue/definitions";
type Props = {
  params: { id: string };
};

const UpdateProductPage: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  const productRepo = new ProductRepository();
  const product = await productRepo.getProductById(Number(id));
  if (!product) {
    return <div>Producto no encontrado</div>;
  }
  return <ProductDetail productProp={product} />
};

export default UpdateProductPage;
