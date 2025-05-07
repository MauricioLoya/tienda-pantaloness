import { NextResponse } from 'next/server';
// import { ResendEmailService } from '@/services/email/ResendEmailService';
// import OrderConfirmationEmail from '@/services/email/templates/OrderConfirmation';
// import { formatPrice } from '@/lib/utils';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: `success`,
  });

  //   try {
  //     // Get API key from environment variable
  //     const resendApiKey = process.env.RESEND_API_KEY;

  //     if (!resendApiKey) {
  //       return NextResponse.json(
  //         { error: 'Missing RESEND_API_KEY environment variable' },
  //         { status: 500 }
  //       );
  //     }

  //     // Set up parameters from URL query parameters or use defaults
  //     const { searchParams } = new URL(request.url);
  //     const recipient = searchParams.get('to') || 'mauloy15@gmail.com';
  //     const subject = searchParams.get('subject') || 'Email Service Test';

  //     // Create an instance of the email service
  //     const emailService = new ResendEmailService(
  //       resendApiKey,
  //       'noreply@mauricioloya.com' // Replace with your actual sender email
  //     );

  //     // Send a test email
  //     await emailService.sendEmail({
  //       to: recipient,
  //       subject: subject,
  //       html: OrderConfirmationEmail({
  //         orderNumber: '123456',
  //         items: [
  //           {
  //             name: 'Pantalon de mezclilla azul 32',
  //             quantity: 1,
  //             price: formatPrice(49.99),
  //             subtotal: formatPrice(49.99),
  //           },
  //           {
  //             name: 'Camisa blanca 40',
  //             quantity: 2,
  //             price: formatPrice(29.99),
  //             subtotal: formatPrice(59.98),
  //           },
  //           {
  //             name: 'Zapatos negros 42',
  //             quantity: 1,
  //             price: formatPrice(89.99),
  //             subtotal: formatPrice(89.99),
  //           },
  //         ],
  //         shippingAddress: '123 Main St, Anytown, USA ',
  //         orderDate: new Date().toISOString(),
  //         orderTotal: formatPrice(198.96),
  //       }),
  //     });

  //     return NextResponse.json({
  //       success: true,
  //       message: `Test email sent successfully to ${recipient}`,
  //     });
  //   } catch (error) {
  //     console.error('Email test failed:', error);
  //     return NextResponse.json(
  //       { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
  //       { status: 500 }
  //     );
  //   }
}
