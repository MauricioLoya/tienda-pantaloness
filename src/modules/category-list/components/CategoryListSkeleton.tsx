import React from 'react'

const CategoryListSkeleton: React.FC = () => {
  return (
    <div className="category-section container mx-auto mt-10">
      {/* Header section with title, description and button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Image placeholder */}
      <div className="mb-10 relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-200 animate-pulse"></div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(item => (
          <div key={item} className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryListSkeleton
