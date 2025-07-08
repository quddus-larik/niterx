// app/api/payment/route.ts
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET = process.env.STRIPE_SECRET;
if (!STRIPE_SECRET) {
  throw new Error('Missing STRIPE_SECRET in environment variables');
}

const stripe = new Stripe(STRIPE_SECRET, {
  apiVersion: '2024-04-10',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // ⬅️ Parse JSON body
    const { amount } = body;

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Sample Product',
            },
            unit_amount: amount * 100, // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:3000/checkout/success`,
      cancel_url: `http://localhost:3000/checkout/cancel`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    console.error('Stripe Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
