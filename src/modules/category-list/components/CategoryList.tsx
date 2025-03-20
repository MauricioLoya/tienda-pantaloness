import React from 'react'
import { CategoryListRepository } from '../definitions'

import { headers } from 'next/headers'
import CategorySection from './CategorySection'

const CategoryList: React.FC = async () => {
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') || 'mx'

  const categoryRepo = new CategoryListRepository()
  const categoriesWithProducts = await categoryRepo.getCategoriesWithProducts(
    4,
    locale
  )

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-16">
        {categoriesWithProducts.map(item => (
          <CategorySection
            key={item.category.id}
            category={item.category}
            products={item.products}
            locale={locale}
          />
        ))}
      </div>
    </div>
  )
}

export default CategoryList
