import React from 'react'
import { ProductListRepository } from '../definitions'
import Link from 'next/link'

const ProductList: React.FC = async () => {
  const productRepository = new ProductListRepository()
  const products = await productRepository.getListItem()
  return (
    <>
      <div>
        {products.map(product => (
          <div key={product.id}>
            <img src={product.thumbnail} alt={product.name} />
            <Link href={`/productos/${product.id}`}>
              <p>{product.name}</p>
              <p>{product.price}</p>
              <p>{product.hasDiscount}</p>
              <p>{product.isAvailable}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}

export default ProductList
