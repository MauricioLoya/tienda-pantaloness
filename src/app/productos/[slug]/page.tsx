import ProductDetail from '@/modules/product-list/componentes/ProductDetails'
import React, { Suspense } from 'react'
type Props = {
  params: { slug: string }
}
const DetalleProducto: React.FC<Props> = ({ params }) => {
  return (
    <>
      <h1>Detalle del producto</h1>
      <p>Slug: {params.slug}</p>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetail slug={params.slug} />
      </Suspense>
    </>
  )
}

export default DetalleProducto
