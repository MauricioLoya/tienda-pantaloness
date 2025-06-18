import Stripe from 'stripe';
import { WebhookEventHandler } from './WebhookEventHandler';

import { prisma } from '@/lib/prima/client';
import { OrderStatus } from '@/lib/types';
import { extractNumbersFromBrackets, generateShortId } from '@/lib/utils';
import { ProductRepository } from '@/modules/catalogue/definitions';
import { OrderEventService } from '@/services/orders/OrderEventService';

export class CheckoutSessionCompletedHandler implements WebhookEventHandler {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  private mapStripePaymentStatusToOrderStatus(paymentStatus: string): OrderStatus {
    switch (paymentStatus) {
      case 'paid':
        return OrderStatus.PENDING_SHIPPED;
      case 'unpaid':
        return OrderStatus.PENDING;
      default:
        return OrderStatus.PENDING;
    }
  }

  async handle(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      return;
    }
    const lineItems = await this.stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    return prisma.$transaction(async tx => {
      const customerDetails: Stripe.Checkout.Session.CustomerDetails | null =
        session.customer_details;
      if (!customerDetails) {
        throw new Error('No se encontraron detalles del cliente.');
      }

      let customer = await tx.customer.findFirst({
        where: {
          email: customerDetails.email || '',
          phone: customerDetails.phone || '',
        },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            name: customerDetails.name || 'Cliente',
            email: customerDetails.email || '',
            phone: customerDetails.phone || '',
          },
        });
      } else {
      }

      const orderNumber = generateShortId();

      const shippingDetails: Stripe.Address | null = customerDetails.address;

      if (!shippingDetails) {
        throw new Error('No se encontraron detalles de envío.');
      }
      const totalAmount = session.amount_total ? session.amount_total / 100 : 0;

      const orderStatus = this.mapStripePaymentStatusToOrderStatus(session.payment_status || '');

      const order = await tx.order.create({
        data: {
          orderNumber: orderNumber,
          customerId: customer.id,
          orderDate: new Date(),
          totalAmount: totalAmount,
          checkoutId: session.id,
          status: orderStatus,
          shipping_line1: shippingDetails.line1 || '',
          shipping_line2: shippingDetails.line2 || '',
          city: shippingDetails.city || '',
          state: shippingDetails.state || '',
          postalCode: shippingDetails.postal_code || '',
          country: shippingDetails.country || '',
          promotionId: session.metadata?.promotionId
            ? Number(session.metadata.promotionId)
            : undefined,
          regionId: session.metadata?.region,
          shippingPrice: (session.shipping_cost?.amount_total ?? 0) / 100,
        },
      });

      for (const item of lineItems.data) {
        const [variantIdFromName, productIdFromName] = extractNumbersFromBrackets(
          item.description || ''
        );
        if (!productIdFromName) {
          continue;
        }
        if (!variantIdFromName) {
          continue;
        }

        const productRepo = new ProductRepository();

        const productItem = await productRepo.getProductById(Number(productIdFromName));

        if (!productItem) {
          continue;
        }

        const productName = item.description || 'Producto';
        const quantity = item.quantity || 1;

        const productImage = item.price?.product ? '' : '';

        const purchasedVariant = productItem.variants.find(
          variant => variant.id === Number(variantIdFromName)
        );

        if (!purchasedVariant) {
          console.error(`❌ Variant not found: ${variantIdFromName}`);
          continue;
        }

        const paidPrice = purchasedVariant?.discountPrice
          ? purchasedVariant.discountPrice
          : purchasedVariant?.price;

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productName,
            productDescription: productItem.product.description,
            productImage,
            quantity,
            price: purchasedVariant?.price,
            paidPrice,
          },
        });
        if (orderStatus === OrderStatus.PENDING_SHIPPED) {
          await tx.productVariant.update({
            where: { id: purchasedVariant.id },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });
        }
      }

      await tx.payment.create({
        data: {
          orderId: order.id,
          stripePayment: totalAmount,
          paymentDate: new Date(),
          amount: totalAmount,
          status: session.payment_status || 'desconocido',
          paymentType: session.payment_method_types?.[0] || 'desconocido',
        },
      });

      OrderEventService.getInstance().emit('order.completed', order.id);

      console.log(`✅ Pago creado para la orden: ${order.id}`);
    });
  }
}
