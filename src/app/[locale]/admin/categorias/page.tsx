import Loader from '@/lib/components/Loader'
import CategoryList from '@/modules/category/components/CategoryList'
import CreateCategory from '@/modules/category/components/CreateCategory'
import { RegionItem, RegionRepository } from '@/modules/region/definitions'
import React, { Suspense } from 'react'

const CategoryPage: React.FC = async () => {
  const regions: RegionItem[] = await new RegionRepository().getAll();
  return (
    <>
      <Suspense fallback={<Loader />}>
        <CreateCategory regions={regions} />
        <CategoryList />
      </Suspense>
    </>
  )
}

export default CategoryPage
