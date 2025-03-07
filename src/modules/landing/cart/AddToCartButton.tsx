'use client'

import { useCart } from '@/context/CartContext'
import { v4 as uuidv4 } from 'uuid'
import React from 'react'

interface Variant {
  id: number
  size: string
  stock: number
  price: number
}

interface AddToCartButtonProps {
  variant?: Variant
  productId: number
  productName: string
  productImage: string
  quantity: number
  disabled?: boolean
}

const AddToCartButton = ({
  variant,
  productId,
  productName,
  productImage,
  quantity = 1,
  disabled = false
}: AddToCartButtonProps) => {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    if (!variant) return

    // Here you would implement your cart logic
    console.log(
      `Added product ${productId} with variant ${variant.id} (size: ${variant.size}) to cart`
    )

    addItem({
      id: uuidv4(),
      productId: productId,
      name: productName,
      price: variant.price,
      size: variant.size,
      quantity: quantity,
      image: productImage,
      variantId: variant.id
    })
  }

  return (
    <button
      onClick={handleAddToCart}
      className="btn btn-block btn-primary text-lg "
      disabled={disabled}
    >
      Añadir al carrito
    </button>
  )
}

export default AddToCartButton
