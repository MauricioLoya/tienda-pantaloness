import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

  // Procesa el evento recibido
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Aquí puedes extraer información (como el session.id) para identificar el pedido.
      // Por ejemplo, podrías actualizar el estado del pedido en tu base de datos.
      console.log(`Checkout session completada: ${session.id}`);
      // TODO: Implementa la lógica para actualizar el estado del pedido,
      // por ejemplo: await updateOrderStatus(session.id, 'completed');
      break;
    }
    // Puedes agregar otros tipos de eventos según lo necesites
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
