import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { WebhookEventHandlerFactory } from './handlers/WebHookEventHandlerFactory';
import { ResendEmailService } from '@/services/email/ResendEmailService';
import { OrderEventService } from '@/services/orders/OrderEventService';
import { OrderRepository } from '@/modules/orders/definitions';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const emailService = new ResendEmailService(
  process.env.RESEND_API_KEY!,
  'No-Reply <yo@mauricioloya.com>'
);
const handlerFactory = new WebhookEventHandlerFactory(stripe);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
export async function POST(request: Request) {
  console.log('Webhook received');

  const sig = request.headers.get('stripe-signature');
  const buf = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, endpointSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error en la verificación de la firma del webhook:', errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  const orderEventService = OrderEventService.getInstance();
  orderEventService.on<number>('order.completed', async (orderId: number) => {
    try {
      const orderRepository = new OrderRepository();
      await orderRepository.sendOrderConfirmationEmail(orderId, emailService);
      console.log(`✅ Email de confirmación enviado para la orden ${orderId}`);
    } catch (error) {
      console.error(`❌ Error enviando email de confirmación para orden ${orderId}:`, error);
    }
  });

  const handler = handlerFactory.getHandler(event.type);

  if (handler) {
    try {
      await handler.handle(event);
    } catch (error) {
      console.error(`Error procesando evento ${event.type}:`, error);
      return new NextResponse(`Error processing webhook: ${error}`, { status: 500 });
    }
  } else {
    console.log(`No handler found for event ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
