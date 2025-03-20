import React, { Suspense } from 'react'
import { ProductListRepository } from '../definitions'
import SectionBox from '@/modules/landing/SectionBox'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { headers } from 'next/headers'

// Skeleton loader grid component
const ProductListSkeleton: React.FC = () => {
  return (
    <div>
      <div className="h-14 bg-gray-300  rounded-lg mb-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
type ProductListContentProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
const ProductListContent: React.FC<ProductListContentProps> = async ({
  searchParams
}) => {
  // Get headers to extract location from URL
  const headersList = await headers()

  // Await and parse search parameters
  const resolvedParams = await searchParams
  const searchQuery = resolvedParams.searchQuery as string | undefined
  const size = resolvedParams.size as string | undefined
  const minPrice = resolvedParams.minPrice
    ? Number(resolvedParams.minPrice)
    : undefined
  const maxPrice = resolvedParams.maxPrice
    ? Number(resolvedParams.maxPrice)
    : undefined
  const sortBy = resolvedParams.sortBy as string | undefined
  const sortDirection = resolvedParams.sortDirection as
    | 'asc'
    | 'desc'
    | undefined

  const locale = headersList.get('x-next-intl-locale') || ''
  const productRepository = new ProductListRepository()
  const products = await productRepository.searchProducts({
    regionCode: locale,
    searchQuery,
    size,
    minPrice: minPrice?.toString(),
    maxPrice: maxPrice?.toString(),
    sortBy,
    sortDirection
  })

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            name={product.name}
            description={product.description}
            basePrice={product.price}
            discountedPrice={12}
            discountPercentage={10}
            thumbnail={product.thumbnail}
            isAvailable={product.isAvailable}
          />
        ))}
      </div>
    </div>
  )
}

// Main component with Suspense
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
const ProductList: React.FC<Props> = ({ searchParams }) => {
  return (
    <SectionBox bgColor="bg-white">
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListContent searchParams={searchParams} />
      </Suspense>
    </SectionBox>
  )
}

export default ProductList
