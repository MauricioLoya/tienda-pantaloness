'use client'

import { ProductVariant } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'

interface SizeSelectorProps {
  variants: ProductVariant[]
  selectedSize?: string
  productId: number
}

const SizeSelector = ({
  variants,
  selectedSize,
  productId
}: SizeSelectorProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSizeSelect = (size: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('size', size)

    // Update URL with the selected size
    router.push(`/productos/${productId}?${params.toString()}`)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Selecciona tu talla</h2>
      <div className="flex gap-2 flex-wrap">
        {variants.map(variant => {
          const isSelected = selectedSize === variant.size
          return (
            <button
              key={variant.id}
              onClick={() => handleSizeSelect(variant.size)}
              className={`w-16 h-16 ${
                isSelected
                  ? 'bg-yellow-300 font-bold'
                  : 'bg-yellow-100 hover:bg-yellow-200'
              } rounded-lg flex items-center justify-center font-medium`}
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
