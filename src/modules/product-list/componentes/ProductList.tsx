import React, { Suspense } from 'react'
import { ProductListRepository } from '../definitions'
import SectionBox from '@/modules/landing/SectionBox'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { headers } from 'next/headers'

// Skeleton loader grid component
const ProductListSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}

// Main product data component
const ProductListContent: React.FC = async () => {
  // Get headers to extract location from URL
  const headersList = await headers()

  const locale = headersList.get('x-next-intl-locale') || ''

  console.log(`Locale: ${locale}`)

  // Extract location from pathname or referer

  const productRepository = new ProductListRepository()
  // Pass location to repository method
  console.log('Getting products from...', locale)

  const products = await productRepository.getListItem(locale)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map(product => (
        <ProductCard
          key={product.id}
          id={product.id.toString()}
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
  )
}

// Main component with Suspense
const ProductList: React.FC = () => {
  return (
    <SectionBox bgColor="bg-white">
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductListContent />
      </Suspense>
    </SectionBox>
  )
}

export default ProductList
