'use server';

import { OrderRepository } from '@/modules/orders/definitions';
import { ResendEmailService } from '@/services/email/ResendEmailService';

export async function sendEmailConfirmation(orderId: number) {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error('Resend API key is not defined');
  }

  const emailService = new ResendEmailService(resendApiKey, 'noreply@mauricioloya.com');

  try {
    const orderRepository = new OrderRepository();
    await orderRepository.resendEmailCorfirmation(orderId, emailService);
    console.log('Correo reenviado con éxito');
  } catch (error) {
    console.log('Error al reenviar el correo:', error);
  }
}
