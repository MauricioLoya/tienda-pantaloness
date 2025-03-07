'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface Props {
  variants: Array<{
    id: number
    size: string
    stock: number
  }>
  selectedSize?: string
  productId: number
  onSizeSelect?: (size: string, variantId: number) => void
}

const SizeSelector = ({
  variants,
  selectedSize,
  productId,
  onSizeSelect
}: Props) => {
  const router = useRouter()

  const handleSizeClick = (size: string, variantId: number) => {
    if (onSizeSelect) {
      // If callback provided, use it (for client-side handling)
      onSizeSelect(size, variantId)
    } else {
      // Otherwise use router navigation (for URL-based selection)
      router.push(`/products/${productId}?size=${size}`)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Selecciona talla</h2>
      <div className="flex flex-wrap gap-3">
        {variants.map(variant => {
          const isSelected = selectedSize === variant.size
          const isOutOfStock = variant.stock <= 0

          return (
            <button
              key={variant.id}
              onClick={() =>
                !isOutOfStock && handleSizeClick(variant.size, variant.id)
              }
              disabled={isOutOfStock}
              className={`
                h-10 w-10 rounded-full flex items-center justify-center 
                ${
                  isSelected
                    ? 'border-2 border-primary'
                    : 'border border-gray-300'
                } 
                ${
                  isOutOfStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'hover:border-gray-400'
                }
              `}
              title={isOutOfStock ? 'Agotado' : `Talla ${variant.size}`}
            >
              {variant.size}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SizeSelector
