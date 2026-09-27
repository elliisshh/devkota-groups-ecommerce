const Stripe = require('stripe');

const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

async function createCheckoutSession({ lineItems, customerEmail, successUrl, cancelUrl }) {
  if (!stripe) {
    return {
      success: true,
      mode: 'mock',
      url: successUrl || '/orders',
      message: 'Stripe not configured; using mock checkout flow.'
    };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return { success: true, mode: 'stripe', id: session.id, url: session.url };
}

module.exports = { createCheckoutSession };
