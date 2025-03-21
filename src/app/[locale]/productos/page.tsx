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

  const sizeListPromise = productListRepository.getVariantSizes(locale)
  const categoryListPromise = await productListRepository.getCategoriesList(
    locale
  )

  const [sizeList, categoryList] = await Promise.all([
    sizeListPromise,
    categoryListPromise
  ])

  return (
    <>
      <SearchBar
        categoryList={categoryList}
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
