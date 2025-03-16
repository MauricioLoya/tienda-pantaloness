import Loader from '@/lib/components/Loader'
import CreateCatalogue from '@/modules/catalogue/components/CreateCatalogue'
import ProductList from '@/modules/catalogue/components/ProductList'
import React, { Suspense } from 'react'
import { CategoryRepository } from "@/modules/category/definitions";

const CatalogoPage: React.FC = async () => {
  return (
    <>
    <Suspense fallback={<Loader />}>
      <CreateCatalogue allCategories={await new CategoryRepository().getAll()} />
      <ProductList />
    </Suspense>
  </>
  )
}

export default CatalogoPage
