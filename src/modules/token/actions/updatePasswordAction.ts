'use server';

import { ResendEmailService } from '@/services/email/ResendEmailService';
import { PasswordResetService } from '../definitions';
import { validateAdminSession } from '@/lib/auth-validation';

export async function UpdatePasswordAction(id: number, password: string) {
  await validateAdminSession();
  const emailService = new ResendEmailService(
    process.env.RESEND_API_KEY || '',
    process.env.EMAIL_FROM || 'noreply@example.com'
  );
  return new PasswordResetService(emailService, 'noreply@example.com').resetPasswordAdmin(
    id,
    password
  );
}
