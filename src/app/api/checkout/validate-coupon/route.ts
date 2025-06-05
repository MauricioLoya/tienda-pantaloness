import { NextResponse } from 'next/server';
import { processPromoCode } from '@/modules/checkout/validations';

export async function POST(req: Request) {
  try {
    const { couponCode, region } = await req.json();
    const result = await processPromoCode(couponCode, region);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Error validando cupón:', err);
    return NextResponse.json(
      { isValidPromo: false, promotionId: undefined, errors: ['Error interno'] },
      { status: 500 }
    );
  }
}

export const config = {
  methods: ['POST'],
};
