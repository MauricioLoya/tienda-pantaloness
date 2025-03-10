"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prima/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface CartItem {
  productId: number;
  variantId: number;
  quantity: number;
}

export interface CheckoutInput {
  items: CartItem[];
  customerInfo?: {
    email?: string;
    name?: string;
  };
  shipping?: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  couponCode?: string;
}

export async function createCheckoutSessionAction(input: CheckoutInput) {
  try {
    if (!input.items || input.items.length === 0) {
      throw new Error("No hay productos en el carrito.");
    }
    const errors: string[] = [];
    let subtotal = 0;
    for (const item of input.items) {
      if (item.quantity <= 0) {
        errors.push(
          `La cantidad para el item con variantId ${item.variantId} debe ser mayor que 0.`
        );
        continue;
      }
      const variant = await prisma.productVariant.findFirst({
        where: {
          id: item.variantId,
          productId: item.productId,
        },
        select: {
          price: true,
        },
      });
      if (!variant) {
        errors.push(
          `La variante ${item.variantId} del producto ${item.productId} no existe.`
        );
        continue;
      }
      subtotal += variant.price * item.quantity;
      console.log("subtotal", subtotal);
    }
    if (errors.length > 0) {
      return {
        success: false,
        message: "Errores en la validación del carrito.",
        data: null,
        errors,
      };
    }

    let discountAmount = 0;

    if (input.couponCode) {
      const now = new Date();
      const promotion = await prisma.promotion.findFirst({
        where: {
          code: input.couponCode,
          active: true,
          isDeleted: false,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      });
      if (!promotion) {
        throw new Error(`El cupón ${input.couponCode} no es válido.`);
      }
      discountAmount = subtotal * (promotion.discount / 100);
    }
    const total = subtotal - discountAmount;
    if (total < 0) {
      throw new Error("El descuento supera el subtotal.");
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Carrito de compras",
            },
            unit_amount: Math.round(total),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: input.customerInfo?.email || undefined,
      success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL}/checkout/cancel`,
    });

    return {
      success: true,
      message: "Sesión de checkout creada exitosamente.",
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
      },
      errors: [],
    };
  } catch (error: any) {
    console.error("Error en createCheckoutSessionAction:", error);
    return {
      success: false,
      message: "Error interno al crear la sesión de checkout.",
      data: null,
      errors: [error?.message || "Error desconocido"],
    };
  }
}
