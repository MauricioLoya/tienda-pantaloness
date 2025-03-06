import ProductDetail from '@/modules/product-list/componentes/ProductDetails'
import ProductDetailsSkeleton from '@/modules/product-list/componentes/ProductDetailsSkeleton'
import { Metadata } from 'next'
import React, { Suspense } from 'react'

type Props = {
  params: { slug: string }
  searchParams: { size?: string }
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  return {
    title: `Product ${params.slug} - Tienda Pantalones`
  }
}

const DetalleProducto: React.FC<Props> = ({ params, searchParams }) => {
  const { slug } = params
  const selectedSize = searchParams.size

  return (
    <>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetail slug={slug} selectedSize={selectedSize} />
      </Suspense>
    </>
  )
}

export default DetalleProducto
