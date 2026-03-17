'use server';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover',
});

export async function createPaymentIntent(amount: number, metadata: Record<string, string> = {}, email?: string) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects cents
            currency: 'eur',
            metadata,
            payment_method_types: ['card'], // Restrict to card only - disables Stripe Link
            ...(email ? { receipt_email: email } : {}),
        });

        return { clientSecret: paymentIntent.client_secret };
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        throw new Error('Error al inicializar el pago seguro con Stripe.');
    }
}
