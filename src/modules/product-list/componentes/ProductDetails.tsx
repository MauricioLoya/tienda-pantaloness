import React from 'react'
import { ProductListRepository } from '../definitions'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import ProductImageGallery from './ProductImageGallery'
import SizeSelector from './SizeSelector'

interface Props {
  slug: string
  selectedSize?: string // Added optional selectedSize parameter
}

// This component will be rendered when the data is available
const ProductDetails = async ({ slug, selectedSize }: Props) => {
  const productRepository = new ProductListRepository()

  try {
    const product = await productRepository.productDetail(Number(slug))

    if (!product) {
      notFound()
    }

    // Sample product images - replace with actual images from your API
    const productImages = [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=500',
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500',
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?q=80&w=500',
      'https://images.unsplash.com/photo-1560243563-062bfc001d68?q=80&w=500',
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=500'
    ]

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Image Gallery */}
          <ProductImageGallery
            images={productImages}
            productName={product.product.name}
            bestSeller={true}
          />

          {/* Right side - Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.product.name}</h1>
              <p className="text-gray-600">Temporada de otoño</p>
            </div>

            {/* Size Selection - Now using the client component */}
            <SizeSelector
              variants={product.variants}
              selectedSize={selectedSize}
              productId={Number(slug)}
            />

            {/* Price */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Precio final</h2>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 line-through">
                  {formatPrice(product.product.basePrice)}
                </span>
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.product.basePrice * 0.75)}
                </span>
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                  %25 OFF
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button className="btn btn-primary w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.log(error)
    notFound()
  }
}

export default ProductDetails
