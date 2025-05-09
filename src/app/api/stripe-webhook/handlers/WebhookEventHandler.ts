import Stripe from 'stripe';

export interface WebhookEventHandler {
  handle(event: Stripe.Event): Promise<void>;
}
