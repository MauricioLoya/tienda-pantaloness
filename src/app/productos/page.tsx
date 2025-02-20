import ProductList from '@/modules/product-list/componentes/ProductList'
import React, { Suspense } from 'react'

const ProductosPage: React.FC = () => {
  return (
    <>
      <h1>Productos</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductList />
      </Suspense>
    </>
  )
}

export default ProductosPage
