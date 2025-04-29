import { NextRequest, NextResponse } from 'next/server';
import { ResendEmailService } from '@/services/email/ResendEmailService';
import { PasswordResetService } from '@/modules/token/definitions';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'El correo electrónico es requerido' }, { status: 400 });
    }

    const emailService = new ResendEmailService(
      process.env.RESEND_API_KEY || '',
      process.env.EMAIL_FROM || 'noreply@example.com'
    );

    const passwordResetService = new PasswordResetService(
      emailService,
      process.env.EMAIL_FROM || 'noreply@example.com'
    );

    await passwordResetService.resetPassword(email);

    return NextResponse.json(
      { message: 'Si tu email está registrado, recibirás una nueva contraseña en breve' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset-password:', error);
    return NextResponse.json(
      { message: 'Ha ocurrido un error al procesar tu solicitud' },
      { status: 500 }
    );
  }
}
