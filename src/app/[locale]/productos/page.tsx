import ProductList from '@/modules/product-list/componentes/ProductList'
import SearchBar from '@/modules/product-list/componentes/SearchBar'
import { ProductListRepository } from '@/modules/product-list/definitions'
import { headers } from 'next/headers'
import React from 'react'
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ProductosPage: React.FC<Props> = async ({ searchParams }) => {
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') || ''
  const { searchQuery, size, minPrice, maxPrice, sortBy, sortDirection } =
    await searchParams
  const productListRepository = new ProductListRepository()
  const sizeList = await productListRepository.getVariantSizes(locale)

  return (
    <>
      <SearchBar
        sizeList={sizeList}
        regionCode={locale}
        searchQuery={searchQuery}
        size={size}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sortBy={sortBy}
        sortDirection={sortDirection}
      />
      <ProductList searchParams={searchParams} />
    </>
  )
}

export default ProductosPage
