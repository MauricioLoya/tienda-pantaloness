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
        return new CheckoutSessionCompletedHandler(this.stripe);
      default:
        console.log(`Unhandled webhook event: ${eventType}`);
        return null;
    }
  }
}
