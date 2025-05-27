import Stripe from 'stripe';
import { CheckoutSessionCompletedHandler } from './CheckoutSessionCompletedHandler';
import { WebhookEventHandler } from './WebhookEventHandler';

export class WebhookEventHandlerFactory {
  private stripe: Stripe;

  constructor(stripe: Stripe) {
    this.stripe = stripe;
  }

  getHandler(eventType: Stripe.Event['type']): WebhookEventHandler | null {
    switch (eventType) {
      case 'checkout.session.completed':
        console.log('Evento de sesión de pago completada recibido!!!!');
        return new CheckoutSessionCompletedHandler(this.stripe);
      default:
        console.log(`Evento no manejado: ${eventType}`);
        return null;
    }
  }
}
