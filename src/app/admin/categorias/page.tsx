import Loader from '@/lib/components/Loader'
import CategoryList from '@/modules/category/components/CategoryList'
import React, { Suspense } from 'react'

const CategoryPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <CategoryList />
      </Suspense>
    </>
  )
}

export default CategoryPage
