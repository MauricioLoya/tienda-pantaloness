import Loader from '@/lib/components/Loader'
import ProductList from '@/modules/catalogue/components/ProductList'
import React, { Suspense } from 'react'

const CatalogoPage: React.FC = async () => {
  return (
    <>
    <Suspense fallback={<Loader />}>
      <ProductList />
    </Suspense>
  </>
  )
}

export default CatalogoPage
