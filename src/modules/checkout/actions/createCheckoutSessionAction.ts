'use server';

import Stripe from 'stripe';
import { ServerActionResult } from '@/lib/types';
import {
  CheckoutErrorCode,
  CheckoutInput,
  CheckoutSessionData,
  processPromoCode,
  validateAndProcessCartItems,
} from '../validations';
import { RegionRepository } from '@/modules/region/definitions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Define supported regions type
export type SupportedRegion = 'mx' | 'us';

// Define locales object with proper typing
const StripeLocales: Record<SupportedRegion, string> = {
  mx: 'es-419',
  us: 'en',
};

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
        errorCode: CheckoutErrorCode.EMPTY_CART,
      };
    }

    // Process promotion code if provided
    const {
      isValidPromo,
      errors: promoErrors,
      promotionId,
    } = await processPromoCode(input.couponCode, region);

    if (!isValidPromo) {
      return {
        success: false,
        message: 'Error al procesar el código de promoción.',
        data: null,
        error: promoErrors.join(' '),
        errorCode: CheckoutErrorCode.INVALID_COUPON,
      };
    }

    // Validate and process cart items
    const { isValid, lineItems, errors } = await validateAndProcessCartItems(
      region,
      input.items,
      promotionId
    );

    if (!isValid) {
      console.log('errors:', errors);
      return {
        success: false,
        message: 'Error al procesar los items del carrito.',
        data: null,
        error: errors.join(' '),
        errorCode: CheckoutErrorCode.INVALID_CART,
      };
    }

    const metadata: Record<string, string> = {
      region: region,
      promotionId: promotionId ? String(promotionId) : '',
    };
    const subtotal = lineItems.reduce((acc, item) => acc + item.price_data.unit_amount, 0);
    const regionItem = await new RegionRepository().getById(region);
    if (!regionItem) {
      return {
        success: false,
        message: 'Error al procesar la región.',
        data: null,
        error: 'Región no encontrada',
        errorCode: CheckoutErrorCode.UNKNOWN_ERROR,
      };
    }

    const freeThreshold = (regionItem.amountForFreeShipping ?? 0) * 100;
    const isFreeShipping = regionItem.isFreeShipping && subtotal >= freeThreshold;
    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: isFreeShipping ? 0 : (regionItem.shippingPrice ?? 0) * 100,
            currency: region === 'mx' ? 'mxn' : 'usd',
          },
          display_name: 'Envío',
          // TODO: Preguntar
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 3 },
            maximum: { unit: 'business_day', value: 5 },
          },
        },
      },
    ];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      locale: StripeLocales[region] as Stripe.Checkout.SessionCreateParams.Locale,
      shipping_address_collection: {
        allowed_countries: [
          region.toUpperCase(),
        ] as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      phone_number_collection: {
        enabled: true,
      },
      payment_method_types: ['card'],
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: 'payment',
      metadata,
      shipping_options: shippingOptions,
      success_url: `${process.env.APP_URL}${region}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}${region}/cart`,
    });

    return {
      success: true,
      message: 'Sesión de checkout creada exitosamente.',
      data: {
        sessionId: session.id,
        checkoutUrl: session.url || '',
      },
    };
  } catch (error: unknown) {
    console.error('Error en createCheckoutSessionAction:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return {
        success: false,
        message: 'Error en el procesador de pagos.',
        data: null,
        error: error.message,
        errorCode: CheckoutErrorCode.STRIPE_ERROR,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: 'Error interno al crear la sesión de checkout.',
        data: null,
        error: error.message,
        errorCode: CheckoutErrorCode.UNKNOWN_ERROR,
      };
    }

    return {
      success: false,
      message: 'Error interno al crear la sesión de checkout.',
      data: null,
      error: 'Error desconocido',
      errorCode: CheckoutErrorCode.UNKNOWN_ERROR,
    };
  }
}
