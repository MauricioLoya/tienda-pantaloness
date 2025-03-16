import Loader from '@/lib/components/Loader'
import CategoryList from '@/modules/category/components/CategoryList'
import CreateCategory from '@/modules/category/components/CreateCategory'
import React, { Suspense } from 'react'

const CategoryPage: React.FC = async () => {
  return (
    <>
      <Suspense fallback={<Loader />}>
        <CreateCategory />
        <CategoryList />
      </Suspense>
    </>
  )
}

export default CategoryPage
