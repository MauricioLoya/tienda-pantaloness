import React from 'react';
import { ProductRepository } from '@/modules/catalogue/definitions';
import HeaderContent from '@/lib/components/HeaderContent';
import ProductDetails from '@/modules/catalogue/components/ProductDetail';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ActivateProduct from '@/modules/catalogue/components/ActivateProduct';
import DeleteProduct from '@/modules/catalogue/components/DeleteProduct';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateProductPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  const productRepo = new ProductRepository();
  const productDetail = await productRepo.getProductById(productId);

  if (!productDetail) {
    return notFound();
  }

  const actions = (
    <>

      <Link href={`./${productId}/edit`} className='btn btn-primary'>
        Editar
      </Link>
      {productDetail.product.isDeleted ? (
        <ActivateProduct product={productDetail.product} />
      ) : (
        <DeleteProduct product={productDetail.product} />
      )}

    </>
  );
  return (
    <>
      <HeaderContent title={`Editar ${productDetail.product.name}`} href='./' action={actions} />
      <ProductDetails productProp={productDetail} />
    </>
  );
}
