import React from 'react';
import { ProductRepository } from '@/modules/catalogue/definitions';
import HeaderContent from '@/lib/components/HeaderContent';
import ProductDetails from '@/modules/catalogue/components/ProductDetail';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    </>
  );
  return (
    <>
      <HeaderContent title={`Editar ${productDetail.product.name}`} href='./' action={actions} />
      <ProductDetails productProp={productDetail} />
    </>
  );
}
