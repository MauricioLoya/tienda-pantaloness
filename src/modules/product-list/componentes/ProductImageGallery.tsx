'use client'

import React, { useState } from 'react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  bestSeller?: boolean
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
  bestSeller = false
}) => {
  const [selectedImage, setSelectedImage] = useState(0)

  // Use placeholder image if no images provided
  const displayImages =
    images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500']

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        {bestSeller && (
          <span className="absolute top-4 right-4 bg-white px-4 py-1 rounded-full text-sm font-semibold z-10">
            BEST SELLER
          </span>
        )}
        <img
          src={displayImages[selectedImage]}
          alt={`${productName} - view ${selectedImage + 1}`}
          className="w-full h-[500px] rounded-lg object-cover"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className={`cursor-pointer border-2 rounded-md overflow-hidden ${
                selectedImage === index
                  ? 'border-primary'
                  : 'border-transparent'
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-24 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImageGallery
