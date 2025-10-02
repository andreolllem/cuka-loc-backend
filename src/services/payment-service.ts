import Stripe from "stripe";
import env from "../config/env";

let stripe: Stripe | null = null;
if (env.stripeSecretKey) {
  stripe = new Stripe(env.stripeSecretKey, { apiVersion: "2023-10-16" });
}

export async function createCheckoutSession({
  rentalId,
  amount,
  successUrl,
  cancelUrl
}: {
  rentalId: number;
  amount: number;
  successUrl: string;
  cancelUrl: string;
}) {
  if (!stripe) {
    return {
      mocked: true,
      url: `${successUrl}?mockedCheckout=true&locacao=${rentalId}`
    };
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "brl",
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: `Locação #${rentalId}`,
            description: "Reserva de equipamento Cuka Loc"
          }
        }
      }
    ],
    metadata: { rentalId: String(rentalId) },
    success_url: successUrl,
    cancel_url: cancelUrl
  });

  return session;
}
