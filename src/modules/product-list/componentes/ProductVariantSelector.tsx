'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import AddToCartButton from '@/modules/landing/cart/AddToCartButton'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface Variant {
  id: number
  size: string
  stock: number
  price: number
  originalPrice?: number
}

interface ProductVariantSelectorProps {
  variants: Variant[]
  selectedSize?: string
  productId: number
  productSlug: string
  productName: string
  productImage: string
}

const ProductVariantSelector = ({
  variants,
  selectedSize,
  productId,
  productSlug,
  productName,
  productImage
}: ProductVariantSelectorProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [quantity, setQuantity] = useState(1)
  const t = useTranslations('ProductVariantSelector')

  const [currentSize, setCurrentSize] = useState<string | undefined>(
    selectedSize
  )
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>()

  // Update size selection
  const handleSizeSelect = (size: string) => {
    setCurrentSize(size)

    // Find the corresponding variant
    const variant = variants.find(v => v.size === size)
    setSelectedVariant(variant)

    // Create new URLSearchParams
    const params = new URLSearchParams(searchParams.toString())
    params.set('size', size)

    // Update URL with the selected size
    router.push(`/productos/${productSlug}?${params.toString()}`, {
      scroll: false
    })
  }

  // Initialize size from URL if not provided directly
  useEffect(() => {
    if (!selectedSize) {
      const sizeFromUrl = searchParams.get('size')
      if (sizeFromUrl) {
        setCurrentSize(sizeFromUrl)
        const variant = variants.find(v => v.size === sizeFromUrl)
        setSelectedVariant(variant)
      }
    } else {
      const variant = variants.find(v => v.size === selectedSize)
      setSelectedVariant(variant)
    }
  }, [selectedSize, searchParams, variants])

  // If no variant is selected yet, use the first available one
  useEffect(() => {
    if (!selectedVariant && variants.length > 0) {
      const availableVariant = variants.find(v => v.stock > 0) || variants[0]
      setCurrentSize(availableVariant.size)
      setSelectedVariant(availableVariant)
    }
  }, [selectedVariant, variants])

  // Reset quantity if it exceeds the available stock when variant changes
  useEffect(() => {
    if (selectedVariant) {
      // Set quantity to the minimum between current quantity and available stock
      const maxAllowedQuantity = Math.min(quantity, selectedVariant.stock)
      if (quantity !== maxAllowedQuantity) {
        setQuantity(maxAllowedQuantity || 1) // Default to 1 if stock is 0
      }
    }
  }, [selectedVariant, quantity])

  const hasDiscount =
    selectedVariant &&
    selectedVariant.originalPrice &&
    selectedVariant.originalPrice > selectedVariant.price
  const discountPercentage = hasDiscount
    ? Math.round(
        ((selectedVariant.originalPrice! - selectedVariant.price) /
          selectedVariant.originalPrice!) *
          100
      )
    : 0

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{t('select_size')}</h2>

      <div className="flex flex-wrap gap-2">
        {variants.map(variant => (
          <button
            key={variant.id}
            onClick={() => handleSizeSelect(variant.size)}
            className={`
              btn btn-primary btn-outline px-4 py-2 border-2 rounded-md transition-all
              ${
                currentSize === variant.size
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-gray-300 hover:border-gray-400'
              }
              ${
                variant.stock <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }
            `}
            disabled={variant.stock <= 0}
          >
            {variant.size}
            {variant.stock <= 0 && (
              <span className="ml-1">({t('sold_out')})</span>
            )}
          </button>
        ))}
      </div>

      {currentSize && (
        <p className="text-sm text-green-600">
          {t('size_selected', { size: currentSize })}
        </p>
      )}

      {/* Quantity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('quantity')}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (quantity === 1) {
                return
              }
              setQuantity(quantity - 1)
            }}
            className="btn btn-square btn-secondary btn-outline border-2 p-2"
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            -
          </button>
          <span className="text-gray-900 font-semibold">{quantity}</span>
          <button
            onClick={() => {
              if (selectedVariant && quantity >= selectedVariant.stock) {
                return
              }
              setQuantity(quantity + 1)
            }}
            className="btn btn-square btn-secondary btn-outline border-2 p-2"
            disabled={!selectedVariant || selectedVariant.stock <= 0}
          >
            +
          </button>
        </div>

        {/* Display available stock information */}
        {selectedVariant && (
          <p className="text-sm text-gray-600">
            {selectedVariant.stock > 0
              ? t('available_items', { stock: selectedVariant.stock })
              : t('sold_out_status')}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{t('final_price')}</h2>
        {selectedVariant && (
          <div className="flex items-center gap-4">
            {hasDiscount && (
              <span className="text-gray-400 line-through">
                {formatPrice(selectedVariant.originalPrice!)}
              </span>
            )}
            <span className="text-3xl font-bold text-primary">
              {formatPrice(selectedVariant.price)}
            </span>
            {hasDiscount && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded">
                {t('discount_percentage', { percentage: discountPercentage })}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Add to Cart Button */}
      <AddToCartButton
        quantity={quantity}
        productId={productId}
        productName={productName}
        productImage={productImage}
        variant={selectedVariant}
        disabled={!selectedVariant || selectedVariant.stock <= 0}
      />
    </div>
  )
}

export default ProductVariantSelector
