'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
// import { ProductVariant } from '@prisma/client'

// Define cart item structure
export interface CartItem {
  id: string
  productId: number
  name: string
  price: number
  size: string
  quantity: number
  image: string
  variantId: number
  maxQuantity: number
}

// Define cart context interface
interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Calculate derived values
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error('Failed to parse cart data', e)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // Add item to cart (or increase quantity if it already exists)
  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      if (newItem.quantity > newItem.maxQuantity) {
        newItem.quantity = newItem.maxQuantity
      }
      const existingItemIndex = currentItems.findIndex(
        item => item.variantId === newItem.variantId
      )

      if (existingItemIndex > -1) {
        // Item exists, increase quantity
        const updatedItems = [...currentItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      } else {
        // Item doesn't exist, add it
        return [...currentItems, newItem]
      }
    })
  }

  // Remove item from cart
  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id))
  }

  // Update item quantity
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return

    setItems(currentItems =>
      // currentItems.map(item => (item.id === id ? { ...item, quantity } : item))
      currentItems.map(item => {
        if (item.id === id) {
          if (quantity > item.maxQuantity) {
            console.log('quantity > item.maxQuantity')

            item.quantity = item.maxQuantity
          } else {
            console.log('else', { quantity, max: item.maxQuantity })

            item.quantity = quantity
          }
        }
        return item
      })
    )
  }

  // Clear the entire cart
  const clearCart = () => {
    setItems([])
  }

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    total
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
