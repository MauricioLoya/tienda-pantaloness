import Stripe from 'stripe';
import { WebhookEventHandler } from './WebhookEventHandler';
import { EmailService } from '@/services/email/EmailService';
import { prisma } from '@/lib/prima/client';
import { OrderStatus } from '@/lib/types';
import { generateOrderNumber } from '@/lib/utils';

export class CheckoutSessionCompletedHandler implements WebhookEventHandler {
  private stripe: Stripe;
  private emailService: EmailService;

  constructor(stripe: Stripe, emailService: EmailService) {
    this.stripe = stripe;
    this.emailService = emailService;
  }

  async handle(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;

    const lineItems = await this.stripe.checkout.sessions.listLineItems(session.id, {
      limit: 100,
    });

    return prisma.$transaction(async tx => {
      const customerDetails: Stripe.Checkout.Session.CustomerDetails | null =
        session.customer_details;
      if (!customerDetails) {
        throw new Error('No se encontraron detalles del cliente.');
      }

      // Buscar cliente por email y teléfono
      let customer = await tx.customer.findFirst({
        where: {
          email: customerDetails.email || '',
          phone: customerDetails.phone || '',
        },
      });

      // Si no existe el cliente, crearlo
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

      // Crear el pedido
      const orderNumber = generateOrderNumber();

      // Obtener dirección de envío
      const shippingDetails: Stripe.Address | null = customerDetails.address;

      if (!shippingDetails) {
        throw new Error('No se encontraron detalles de envío.');
      }

      const order = await tx.order.create({
        data: {
          orderNumber: orderNumber,
          customerId: customer.id,
          orderDate: new Date(),
          totalAmount: session.amount_total ? session.amount_total / 100 : 0, // Convertir de centavos a unidades
          checkoutId: session.id,
          status: OrderStatus.PROCESSING,
          shipping_line1: shippingDetails.line1 || '',
          shipping_line2: shippingDetails.line2 || '',
          city: shippingDetails.city || '',
          state: shippingDetails.state || '',
          postalCode: shippingDetails.postal_code || '',
          country: shippingDetails.country || '',
          promotionId: session.metadata?.promotionId
            ? Number(session.metadata.promotionId)
            : undefined,
          regionId: session.metadata?.regionId, // Si estás pasando la región como metadata en la sesión
        },
      });

      console.log(`Pedido creado: ${order.id}, Número: ${orderNumber}`);

      for (const item of lineItems.data) {
      }
    });
  }
}
