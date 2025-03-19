import ProductList from '@/modules/product-list/componentes/ProductList'
import SearchBar from '@/modules/product-list/componentes/SearchBar'
import { headers } from 'next/headers'
import React from 'react'
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ProductosPage: React.FC<Props> = async ({ searchParams }) => {
  const { searchQuery, size, minPrice, maxPrice, sortBy, sortDirection } =
    await searchParams

  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') || ''

  return (
    <>
      <SearchBar
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
