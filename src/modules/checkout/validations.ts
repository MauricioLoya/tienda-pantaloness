import { prisma } from '@/lib/prima/client'

// Helper function to round to 2 decimal places
const roundToTwoDecimals = (value: number): number => {
  return Number(value.toFixed(2))
}

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
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  ITEMS_NOT_BELONG_SAME_REGION = 'ITEMS_NOT_BELONG_SAME_REGION'
}

export type CheckoutSessionData = {
  sessionId: string
  checkoutUrl: string
}

/**
 * Validates cart items and prepares line items for Stripe
 */
export async function validateAndProcessCartItems(
  region: string,
  items: CartItem[],
  promotionId?: number
): Promise<{
  isValid: boolean
  lineItems: LineItemsStripe[]
  errors: string[]
}> {
  const errors: string[] = []

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
      regionId: true,
      region: {
        select: {
          name: true,
          currencyCode: true
        }
      },
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
      size: true,
      discountPrice: true
    }
  })

  // Create lookup maps for faster access
  const productMap = new Map(products.map(p => [p.id, p]))
  const variantMap = new Map(variants.map(v => [`${v.productId}-${v.id}`, v]))

  const areAllProductsFromSameRegion = products.every(
    p => p.regionId === region
  )
  if (!areAllProductsFromSameRegion) {
    errors.push('Todos los productos deben ser de la misma región.')
  }

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

    let unitPrice = roundToTwoDecimals(variant.discountPrice ?? variant.price)
    let subtotal = roundToTwoDecimals(unitPrice * item.quantity)
    console.log('promotionID:', promotionId)

    if (promotionId) {
      console.log('Applying promotion:', promotionId)

      const now = new Date()
      const promotion = await prisma.promotion.findFirst({
        where: {
          id: promotionId,
          active: true,
          isDeleted: false,
          startDate: { lte: now },
          endDate: { gte: now }
        }
      })

      if (promotion) {
        // Determine if it's a percentage discount (assuming discount > 1 means percentage)
        if (promotion.discount > 0 && promotion.discount <= 100) {
          // Percentage discount
          unitPrice = roundToTwoDecimals(
            unitPrice - (unitPrice * promotion.discount) / 100
          )
        } else {
          // Fixed amount discount per unit
          unitPrice = roundToTwoDecimals(
            Math.max(0, unitPrice - promotion.discount)
          )
        }
        subtotal = roundToTwoDecimals(unitPrice * item.quantity)
      }
    }

    lineItems.push({
      price_data: {
        currency: product?.region?.currencyCode ?? 'usd',
        product_data: {
          name: `${product.name} - ${variant.size}`,
          description: product.description,
          images: [product.ProductImage.map(img => img.url)[0]]
        },
        unit_amount: Math.round(subtotal * 100) // Stripe requires amount in cents (whole numbers)
      },
      quantity: item.quantity
    })
  }

  return {
    isValid: errors.length === 0,
    lineItems,

    errors
  }
}

/**
 * Processes promotion code and calculates discount
 */
export async function processPromoCode(
  couponCode: string | undefined,
  region: string
): Promise<{
  isValidPromo: boolean
  promotionId?: number
  errors: string[]
}> {
  const errors: string[] = []
  let promotionId: number | undefined = undefined

  if (couponCode) {
    console.log('Validating promotion:', couponCode, region)

    const now = new Date()
    const promotion = await prisma.promotion.findFirst({
      where: {
        code: couponCode,
        regionId: region,
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
        errors
      }
    }

    promotionId = promotion.id
  }

  return {
    isValidPromo: errors.length === 0,
    promotionId,
    errors
  }
}

export async function validateRegions(region: string): Promise<boolean> {
  const regions = await prisma.region.findFirst({
    where: { name: region }
  })
  return regions ? true : false
}
