import React from 'react'

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card card-compact bg-base-100 lg:w-72 shadow-xl h-[600px] flex flex-col animate-pulse">
      <div className="h-80 bg-gray-300 rounded-t-lg"></div>
      <div className="card-body flex flex-col flex-1">
        <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded-md w-full"></div>
          <div className="h-4 bg-gray-300 rounded-md w-full"></div>
          <div className="h-4 bg-gray-300 rounded-md w-2/3"></div>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-col">
            <div className="h-6 bg-gray-300 rounded-md w-1/2"></div>
          </div>
          <div className="card-actions justify-end">
            <div className="h-10 bg-gray-300 rounded-md w-32"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCardSkeleton
