import { prisma } from '@/lib/prima/client'

export interface CartItem {
  productId: number
  variantId: number
  quantity: number
}

export interface CheckoutInput {
  items: CartItem[]
  customerInfo?: {
    email?: string
    name?: string
  }
  shipping?: {
    address: string
    city: string
    country: string
    postalCode: string
  }
  couponCode?: string
}

export type LineItemsStripe = {
  price_data: {
    currency: string
    product_data: {
      name: string
      description: string
      images?: [string]
    }
    unit_amount: number
  }
  quantity: number
}

/**
 * Error codes for checkout process
 */
export enum CheckoutErrorCode {
  EMPTY_CART = 'EMPTY_CART',
  INVALID_QUANTITY = 'INVALID_QUANTITY',
  INVALID_CART = 'INVALID_CART',
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  VARIANT_NOT_FOUND = 'VARIANT_NOT_FOUND',
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  INVALID_COUPON = 'INVALID_COUPON',
  DISCOUNT_EXCEEDS_TOTAL = 'DISCOUNT_EXCEEDS_TOTAL',
  STRIPE_ERROR = 'STRIPE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export type CheckoutSessionData = {
  sessionId: string
  checkoutUrl: string
}

/**
 * Validates cart items and prepares line items for Stripe
 */
export async function validateAndProcessCartItems(items: CartItem[]): Promise<{
  isValid: boolean
  lineItems: LineItemsStripe[]
  subtotal: number
  errors: string[]
}> {
  const errors: string[] = []
  let subtotal = 0
  const lineItems: LineItemsStripe[] = []

  // Fetch all products and variants in one query to reduce database calls
  const productIds = items.map(item => item.productId)
  const variantIds = items.map(item => item.variantId)

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      description: true,
      ProductImage: {
        select: { url: true }
      }
    }
  })

  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
      productId: { in: productIds }
    },
    select: {
      id: true,
      productId: true,
      price: true,
      stock: true,
      size: true
    }
  })

  // Create lookup maps for faster access
  const productMap = new Map(products.map(p => [p.id, p]))
  const variantMap = new Map(variants.map(v => [`${v.productId}-${v.id}`, v]))

  for (const item of items) {
    if (item.quantity <= 0) {
      errors.push(
        `La cantidad para el item con variantId ${item.variantId} debe ser mayor que 0.`
      )
      continue
    }

    const product = productMap.get(item.productId)
    if (!product) {
      errors.push(`El producto ${item.productId} no existe.`)
      continue
    }

    const variant = variantMap.get(`${item.productId}-${item.variantId}`)
    if (!variant) {
      errors.push(
        `La variante ${item.variantId} del producto ${item.productId} no existe.`
      )
      continue
    }

    if (variant.stock < item.quantity) {
      errors.push(
        `Stock insuficiente para la variante ${item.variantId} del producto ${item.productId}.`
      )
      continue
    }

    subtotal += variant.price * item.quantity
    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: `${product.name} - ${variant.size}`,
          description: product.description,
          images: [product.ProductImage.map(img => img.url)[0]]
        },
        unit_amount: Math.round(variant.price * 100)
      },
      quantity: item.quantity
    })
  }

  return {
    isValid: errors.length === 0,
    lineItems,
    subtotal,
    errors
  }
}

/**
 * Processes promotion code and calculates discount
 */
export async function processPromoCode(
  couponCode: string | undefined,
  subtotal: number
): Promise<{
  isValidPromo: boolean
  discountAmount: number
  promotionId?: number
  errors: string[]
}> {
  const errors: string[] = []
  let discountAmount = 0
  let promotionId: number | undefined = undefined

  if (couponCode) {
    const now = new Date()
    const promotion = await prisma.promotion.findFirst({
      where: {
        code: couponCode,
        active: true,
        isDeleted: false,
        startDate: { lte: now },
        endDate: { gte: now }
      }
    })

    if (!promotion) {
      errors.push(`El cupón ${couponCode} no es válido.`)
      return {
        isValidPromo: false,
        discountAmount: 0,
        errors
      }
    }

    discountAmount = subtotal * (promotion.discount / 100)
    promotionId = promotion.id
  }

  return {
    isValidPromo: errors.length === 0,
    discountAmount,
    promotionId,
    errors
  }
}
