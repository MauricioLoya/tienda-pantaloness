import React, { Suspense } from 'react';
import { ProductRepository } from '@/modules/catalogue/definitions';
import HeaderContent from '@/lib/components/HeaderContent';
import ProductDetails from '@/modules/catalogue/components/ProductDetail';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ActivateProduct from '@/modules/catalogue/components/ActivateProduct';
import DeleteProduct from '@/modules/catalogue/components/DeleteProduct';
import { numericRouteGuard } from '@/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};

// Skeleton component for the product details
const ProductDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-200 rounded"></div>
        <div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>

          <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
        </div>
      </div>
    </div>
  );
};

// Skeleton for action buttons
const ActionsSkeleton = () => {
  return (
    <>
      <div className="h-10 bg-gray-200 rounded w-24 inline-block mr-2"></div>
      <div className="h-10 bg-gray-200 rounded w-24 inline-block"></div>
    </>
  );
};

// Product detail container with data fetching
const ProductDetailsContainer = async ({ id }: { id: string }) => {
  const productId = numericRouteGuard(id);

  const productRepo = new ProductRepository();
  let productDetail;
  try {
    productDetail = await productRepo.getProductById(Number(productId));
  } catch (err) {
    console.error('Error fetching product details:', err);
    return notFound();
  }

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
};

export default async function UpdateProductPage({ params }: Props) {
  const id = numericRouteGuard((await params).id);

  return (
    <Suspense fallback={
      <>
        <HeaderContent title="Cargando producto..." href='./' action={<ActionsSkeleton />} />
        <ProductDetailsSkeleton />
      </>
    }>
      <ProductDetailsContainer id={String(id)} />
    </Suspense>
  );
}
