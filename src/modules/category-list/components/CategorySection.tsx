import React from 'react'

import { Category } from '../definitions'
import ProductCard from '@/modules/product-list/componentes/ProductCard'
import { ItemProduct } from '@/modules/product-list/definitions'
import { Link } from '@/i18n/navigation'

interface CategorySectionProps {
  category: Category
  products: ItemProduct[]
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products
}) => {
  return (
    <div className="category-section">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{category.name}</h2>
          {category.description && (
            <p className="text-gray-600 mt-2">{category.description}</p>
          )}
        </div>
        <Link
          href={`/productos?category=${category.id}`}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Ver todos <span className="ml-2">→</span>
        </Link>
      </div>

      {category.imageUrl && (
        <div className="mb-10 relative h-64 md:h-96 rounded-xl overflow-hidden">
          <img
            src={category?.imageUrl ?? 'not-found'}
            alt={category?.name ?? 'not-found'}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6 text-white">
              <h3 className="text-2xl font-bold">{category.name}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            basePrice={product.price}
            description={product.description}
            discountedPrice={product.price}
            discountPercentage={product.price}
            isAvailable={product.isAvailable}
            name={product.name}
            thumbnail={product.thumbnail}
          />
        ))}
      </div>
    </div>
  )
}

export default CategorySection
