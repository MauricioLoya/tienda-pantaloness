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

  getHandler(eventType: Stripe.Event['type']): WebhookEventHandler | null {
    switch (eventType) {
      case 'checkout.session.completed':
        console.log('Evento de sesión de pago completada recibido!!!!');
        return new CheckoutSessionCompletedHandler(this.stripe, this.emailService);
      default:
        console.log(`Evento no manejado: ${eventType}`);
        return null;
    }
  }
}
