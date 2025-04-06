import { EmailService } from '@/services/email/EmailService';
import Stripe from 'stripe';
import { CheckoutSessionCompletedHandler } from './CheckoutSessionCompletedHandler';
import { WebhookEventHandler } from './WebhookEventHandler';

export class WebhookEventHandlerFactory {
  private stripe: Stripe;
  private emailService: EmailService;

  constructor(stripe: Stripe, emailService: EmailService) {
    this.stripe = stripe;
    this.emailService = emailService;
  }

  getHandler(event: Stripe.Event): WebhookEventHandler | null {
    switch (event.type) {
      case 'checkout.session.completed':
        return new CheckoutSessionCompletedHandler(this.stripe, this.emailService);
      // Puedes agregar otros tipos de eventos y sus respectivos handlers aquí
      default:
        console.log(`Evento no manejado: ${event.type}`);
        return null;
    }
  }
}
