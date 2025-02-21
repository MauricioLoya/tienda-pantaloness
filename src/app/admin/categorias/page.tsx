import Loader from '@/lib/components/Loader'
import Header from '@/modules/admin-dashboard/components/Header'
import CategoryList from '@/modules/category/components/CategoryList'
import React, { Suspense } from 'react'

const CategoryPage: React.FC = async () => {
  return (
    <>
      <Header
        title="📈 Tu dashboard"
        description="Aquí puedes ver información relevante sobre el sistema."
      />
      <Suspense fallback={<Loader />}>
        <CategoryList />
      </Suspense>
    </>
  )
}

export default CategoryPage
