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
  console.log("createCheckoutSessionAction input:", input);
  try {
    if (!input.items || input.items.length === 0) {
      throw new Error("No hay productos en el carrito.");
    }
    const errors: string[] = [];
    let subtotal = 0;
    const lineItems: any = []
    for (const item of input.items) {
      if (item.quantity <= 0) {
        errors.push(
          `La cantidad para el item con variantId ${item.variantId} debe ser mayor que 0.`
        );
        continue;
      }
      const product = await prisma.product.findFirst({
        where: {
          id: item.productId
        },
        select: {
          name: true
        }
      })
      if (!product) {
        errors.push(
          `El producto ${item.productId} no existe.`
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
          stock: true,
          size: true,
        },
      });
      if (!variant) {
        errors.push(
          `La variante ${item.variantId} del producto ${item.productId} no existe.`
        );
        continue;
      }
      if (variant.stock < item.quantity) {
        errors.push(
          `Stock insuficiente para la variante ${item.variantId} del producto ${item.productId}.`
        );
        continue;
      }
      subtotal += variant.price * item.quantity;
      lineItems.push({
        price_data: {
          currency: "mxn",
          product_data: {
            name: `${product.name} - ${variant.size}`,
            description: "Producto del carrito",
          },
          unit_amount: Math.round(variant.price * 100),
        },
        quantity: item.quantity,
      });
    }

    if (errors.length > 0) {
      console.log("errors:", errors);
      throw new Error(errors.join(" "));
    }

    let discountAmount = 0;
    let promotionId: number | undefined = undefined;
    if (input.couponCode) {
      console.log("input.couponCode:", input.couponCode);
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
      promotionId = promotion.id;
    }

    const total = subtotal - discountAmount;
    if (total < 0) {
      throw new Error("El descuento supera el subtotal.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
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
