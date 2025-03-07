import React from 'react'
import { ProductListRepository } from '../definitions'
import { notFound } from 'next/navigation'
import ProductImageGallery from './ProductImageGallery'
import ProductVariantSelector from './ProductVariantSelector'

interface Props {
  slug: string
  selectedSize?: string
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

            <ProductVariantSelector
              productImage={productImages[0]}
              productName={product.product.name}
              variants={product.variants}
              selectedSize={selectedSize}
              productId={Number(slug)}
            />
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
