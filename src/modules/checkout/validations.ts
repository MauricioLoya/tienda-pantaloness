import { prisma } from '@/lib/prima/client';
import { getTranslations } from 'next-intl/server';

// Helper function to round to 2 decimal places
const roundToTwoDecimals = (value: number): number => {
  return Number(value.toFixed(2));
};

export interface CartItem {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CheckoutInput {
  items: CartItem[];
  couponCode?: string;
}

export type LineItemsStripe = {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description: string;
      images?: [string];
    };
    unit_amount: number;
  };
  quantity: number;
};

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
  ITEMS_NOT_BELONG_SAME_REGION = 'ITEMS_NOT_BELONG_SAME_REGION',
}

export type CheckoutSessionData = {
  sessionId: string;
  checkoutUrl: string;
};

export async function validateAndProcessCartItems(
  region: string,
  items: CartItem[],
  promotionId?: number
): Promise<{
  isValid: boolean;
  lineItems: LineItemsStripe[];
  errors: string[];
}> {
  const errors: string[] = [];

  const lineItems: LineItemsStripe[] = [];

  // Fetch all products and variants in one query to reduce database calls
  const productIds = items.map(item => item.productId);
  const variantIds = items.map(item => item.variantId);

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
          currencyCode: true,
        },
      },
      ProductImage: {
        select: { url: true },
      },
    },
  });

  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
      productId: { in: productIds },
    },
    select: {
      id: true,
      productId: true,
      price: true,
      stock: true,
      size: true,
      discountPrice: true,
    },
  });

  const productMap = new Map(products.map(p => [p.id, p]));
  const variantMap = new Map(variants.map(v => [`${v.productId}-${v.id}`, v]));

  const areAllProductsFromSameRegion = products.every(p => p.regionId === region);
  if (!areAllProductsFromSameRegion) {
    const translatedError = await getCheckoutErrorMessage(
      CheckoutErrorCode.ITEMS_NOT_BELONG_SAME_REGION,
      region
    );
    errors.push(translatedError);
  }

  for (const item of items) {
    if (item.quantity <= 0) {
      const translatedError = await getCheckoutErrorMessage(
        CheckoutErrorCode.INVALID_QUANTITY,
        region,
        { variantId: item.variantId.toString() }
      );
      errors.push(translatedError);
      continue;
    }

    const product = productMap.get(item.productId);
    if (!product) {
      const translatedError = await getCheckoutErrorMessage(
        CheckoutErrorCode.PRODUCT_NOT_FOUND,
        region,
        { productId: item.productId.toString() }
      );
      errors.push(translatedError);

      continue;
    }

    const variant = variantMap.get(`${item.productId}-${item.variantId}`);
    if (!variant) {
      const translatedError = await getCheckoutErrorMessage(
        CheckoutErrorCode.VARIANT_NOT_FOUND,
        region,
        { variantId: item.variantId.toString(), productId: item.productId.toString() }
      );
      errors.push(translatedError);
      continue;
    }

    if (variant.stock < item.quantity) {
      const translatedError = await getCheckoutErrorMessage(
        CheckoutErrorCode.INSUFFICIENT_STOCK,
        region,
        { variantId: item.variantId.toString(), productId: item.productId.toString() }
      );
      errors.push(translatedError);
      continue;
    }

    let unitPrice = roundToTwoDecimals(variant.discountPrice ?? variant.price);
    let subtotal = roundToTwoDecimals(unitPrice);

    if (promotionId) {
      const now = new Date();
      const promotion = await prisma.promotion.findFirst({
        where: {
          id: promotionId,
          active: true,
          isDeleted: false,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });

      if (promotion) {
        // Determine if it's a percentage discount (assuming discount > 1 means percentage)
        if (promotion.discount > 0 && promotion.discount <= 100) {
          // Percentage discount
          unitPrice = roundToTwoDecimals(unitPrice - (unitPrice * promotion.discount) / 100);
        } else {
          // Fixed amount discount per unit
          unitPrice = roundToTwoDecimals(Math.max(0, unitPrice - promotion.discount));
        }
        subtotal = roundToTwoDecimals(unitPrice);
      }
    }

    lineItems.push({
      price_data: {
        currency: product?.region?.currencyCode ?? 'usd',
        product_data: {
          name: `${product.name} - ${variant.size} [${variant.id}-${product.id}]`,
          description: product.description,
          images: [product.ProductImage.map(img => img.url)[0]],
        },
        unit_amount: Math.round(subtotal * 100), // Stripe requires amount in cents (whole numbers)
      },
      quantity: item.quantity,
    });
  }

  return {
    isValid: errors.length === 0,
    lineItems,

    errors,
  };
}

/**
 * Processes promotion code and calculates discount
 */
export async function processPromoCode(
  couponCode: string | undefined,
  region: string
): Promise<{
  isValidPromo: boolean;
  promotionId?: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let promotionId: number | undefined = undefined;

  if (couponCode) {
    console.log('Validating promotion:', couponCode, region);

    const now = new Date();
    const promotion = await prisma.promotion.findFirst({
      where: {
        code: couponCode,
        regionId: region,
        active: true,
        isDeleted: false,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (!promotion) {
      errors.push('INVALID_COUPON');
      return {
        isValidPromo: false,
        errors,
      };
    }

    promotionId = promotion.id;
  }

  return {
    isValidPromo: errors.length === 0,
    promotionId,
    errors,
  };
}

export async function validateRegions(region: string): Promise<boolean> {
  const regions = await prisma.region.findFirst({
    where: { name: region },
  });
  return regions ? true : false;
}

export async function getCheckoutErrorMessage(
  errorCode: CheckoutErrorCode,
  locale: string,
  params?: Record<string, string | number>
): Promise<string> {
  const t = await getTranslations({ locale, namespace: 'CheckoutErrors' });

  switch (errorCode) {
    case CheckoutErrorCode.EMPTY_CART:
      return t('empty_cart');
    case CheckoutErrorCode.INVALID_QUANTITY:
      return t('invalid_quantity', params);
    case CheckoutErrorCode.INVALID_CART:
      return t('invalid_cart');
    case CheckoutErrorCode.PRODUCT_NOT_FOUND:
      return t('product_not_found', params);
    case CheckoutErrorCode.VARIANT_NOT_FOUND:
      return t('variant_not_found', params);
    case CheckoutErrorCode.INSUFFICIENT_STOCK:
      return t('insufficient_stock', params);
    case CheckoutErrorCode.INVALID_COUPON:
      return t('invalid_coupon');
    case CheckoutErrorCode.DISCOUNT_EXCEEDS_TOTAL:
      return t('discount_exceeds_total');
    case CheckoutErrorCode.STRIPE_ERROR:
      return t('stripe_error');
    case CheckoutErrorCode.ITEMS_NOT_BELONG_SAME_REGION:
      return t('items_not_belong_same_region');
    case CheckoutErrorCode.UNKNOWN_ERROR:
    default:
      return t('unknown_error');
  }
}
