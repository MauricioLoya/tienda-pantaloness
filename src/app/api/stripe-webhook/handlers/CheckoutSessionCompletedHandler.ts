import Stripe from 'stripe';
import { WebhookEventHandler } from './WebhookEventHandler';
import { EmailService } from '@/services/email/EmailService';
import { prisma } from '@/lib/prima/client';
import { OrderStatus } from '@/lib/types';
import { generateShortId } from '@/lib/utils';

export class CheckoutSessionCompletedHandler implements WebhookEventHandler {
  private stripe: Stripe;
  private emailService: EmailService;

  constructor(stripe: Stripe, emailService: EmailService) {
    this.stripe = stripe;
    this.emailService = emailService;
  }

  private mapStripePaymentStatusToOrderStatus(paymentStatus: string): OrderStatus {
    switch (paymentStatus) {
      case 'paid':
        return OrderStatus.COMPLETED;
      case 'unpaid':
        return OrderStatus.PENDING;
      case 'no_payment_required':
        return OrderStatus.COMPLETED;
      default:
        return OrderStatus.PENDING;
    }
  }

  async handle(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== 'paid') {
      console.log('La sesión de pago no fue exitosa.');
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
        console.log(`Nuevo cliente creado: ${customer.id}`);
      } else {
        console.log(`Cliente existente encontrado: ${customer.id}`);
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
          regionId: session.metadata?.regionId,
          shippingPrice: session.shipping_cost?.amount_total ?? 0,
        },
      });

      for (const item of lineItems.data) {
        const productName = item.description || 'Producto';
        const quantity = item.quantity || 1;
        const price = item.amount_total ? item.amount_total / 100 : 0;

        const productDescription = item.price?.product || 'Descripción no disponible';
        const productImage = item.price?.product ? '' : '';

        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productName,
            productDescription: productDescription.toString(),
            productImage,
            quantity,
            price,
          },
        });
        console.log(`✅ Producto agregado a la orden: ${productName} x${quantity}`);
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

      console.log(`✅ Pago creado para la orden: ${order.id}`);
    });
  }
}
