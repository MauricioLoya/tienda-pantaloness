'use server'

import Stripe from 'stripe'
import { ServerActionResult } from '@/lib/types'
import {
  CheckoutErrorCode,
  CheckoutInput,
  CheckoutSessionData,
  processPromoCode,
  validateAndProcessCartItems
} from '../validations'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Define supported regions type
export type SupportedRegion = 'mx' | 'us'

// Define locales object with proper typing
const StripeLocales: Record<SupportedRegion, string> = {
  mx: 'es-419',
  us: 'en'
}

/**
 * Creates a checkout session for the provided cart items
 * @param input - Cart items and customer information
 * @returns Checkout session details or error information
 */
export async function createCheckoutSessionAction(
  region: SupportedRegion,
  input: CheckoutInput
): Promise<ServerActionResult<CheckoutSessionData | null>> {
  try {
    if (!input.items || input.items.length === 0) {
      return {
        success: false,
        message: 'No hay productos en el carrito.',
        data: null,
        error: 'El carrito está vacío',
        errorCode: CheckoutErrorCode.EMPTY_CART
      }
    }

    // Process promotion code if provided
    const {
      isValidPromo,
      errors: promoErrors,
      promotionId
    } = await processPromoCode(input.couponCode, region)

    if (!isValidPromo) {
      return {
        success: false,
        message: 'Error al procesar el código de promoción.',
        data: null,
        error: promoErrors.join(' '),
        errorCode: CheckoutErrorCode.INVALID_COUPON
      }
    }

    console.log('promotionId:', promotionId)

    // Validate and process cart items
    const { isValid, lineItems, errors } = await validateAndProcessCartItems(
      region,
      input.items,
      promotionId
    )

    if (!isValid) {
      console.log('errors:', errors)
      return {
        success: false,
        message: 'Error al procesar los items del carrito.',
        data: null,
        error: errors.join(' '),
        errorCode: CheckoutErrorCode.INVALID_CART
      }
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      locale: StripeLocales[
        region
      ] as Stripe.Checkout.SessionCreateParams.Locale,
      shipping_address_collection: {
        allowed_countries: [
          region.toUpperCase()
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
      },
      phone_number_collection: {
        enabled: true
      },
      payment_method_types: ['card'],
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: 'payment',
      customer_email: input.customerInfo?.email || undefined,
      success_url: `${process.env.APP_URL}${region}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}${region}/cart`
    })

    return {
      success: true,
      message: 'Sesión de checkout creada exitosamente.',
      data: {
        sessionId: session.id,
        checkoutUrl: session.url || ''
      }
    }
  } catch (error: unknown) {
    console.error('Error en createCheckoutSessionAction:', error)

    if (error instanceof Stripe.errors.StripeError) {
      return {
        success: false,
        message: 'Error en el procesador de pagos.',
        data: null,
        error: error.message,
        errorCode: CheckoutErrorCode.STRIPE_ERROR
      }
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: 'Error interno al crear la sesión de checkout.',
        data: null,
        error: error.message,
        errorCode: CheckoutErrorCode.UNKNOWN_ERROR
      }
    }

    return {
      success: false,
      message: 'Error interno al crear la sesión de checkout.',
      data: null,
      error: 'Error desconocido',
      errorCode: CheckoutErrorCode.UNKNOWN_ERROR
    }
  }
}
