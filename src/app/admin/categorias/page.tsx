import CategoryList from '@/modules/category/components/CategoryList'
import { CategoryRepository } from '@/modules/category/definitions'
import React, { Suspense } from 'react'

const CategoryPage: React.FC = async () => {
  const categoryRepo = new CategoryRepository()
  const categories = await categoryRepo.getAll()

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryList categories={categories.map(c => c.name)} />
      </Suspense>
    </>
  )
}

export default CategoryPage
