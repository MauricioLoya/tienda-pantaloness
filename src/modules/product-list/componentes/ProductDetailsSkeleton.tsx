import React from 'react';

export default function ProductDetailsSkeleton() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Left side - Image Skeleton */}
        <div className='relative'>
          <div className='skeleton w-full h-[600px] rounded-lg'></div>
        </div>

        {/* Right side - Product Details Skeleton */}
        <div className='space-y-6'>
          {/* Product Title and Description */}
          <div>
            <div className='skeleton h-10 w-3/4 mb-2'></div>
            <div className='skeleton h-4 w-1/2'></div>
          </div>

          {/* Size Selection */}
          <div>
            <div className='skeleton h-8 w-1/3 mb-3'></div>
            <div className='flex gap-2 flex-wrap'>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className='skeleton w-16 h-16 rounded-lg'></div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className='space-y-4'>
            <div className='skeleton h-8 w-1/4'></div>
            <div className='flex items-center gap-4'>
              <div className='skeleton h-6 w-20'></div>
              <div className='skeleton h-10 w-32'></div>
              <div className='skeleton h-8 w-16 rounded'></div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className='skeleton h-12 w-full rounded-lg'></div>
        </div>
      </div>
    </div>
  );
}
