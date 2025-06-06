import ProductDetail from '@/modules/product-list/componentes/ProductDetails';
import ProductDetailsSkeleton from '@/modules/product-list/componentes/ProductDetailsSkeleton';
import RelatedProducts from '@/modules/product-list/componentes/RelatedProducts';
import { Metadata } from 'next';
import React, { Suspense } from 'react';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ size?: string }>;
};

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  return {
    title: `${slug.toLocaleUpperCase()} - Tienda Pantalones`,
  };
};

const DetalleProducto: React.FC<Props> = async ({ params, searchParams }) => {
  const { slug } = await params;
  const { size } = await searchParams;

  return (
    <>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetail slug={slug} selectedSize={size} />
      </Suspense>
      <RelatedProducts slug={slug} />
    </>
  );
};

export default DetalleProducto;
