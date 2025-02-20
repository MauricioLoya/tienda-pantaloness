import React from 'react'
import { ProductDetail as PD, ProductListRepository } from '../definitions'
type Props = {
  slug: string | number
}
const ProductDetail: React.FC<Props> = async ({ slug }) => {
  const productRepository = new ProductListRepository()
  let detail: PD | null = null
  if (typeof slug === 'string') {
    detail = await productRepository.productDetail(Number(slug))
  }
  if (typeof slug === 'number') {
    detail = await productRepository.productDetail(slug)
  }

  if (!detail) {
    return <div>Producto no encontrado</div>
  }

  return <>{JSON.stringify(detail)}</>
}

export default ProductDetail
