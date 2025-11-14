// app/api/webhook/route.js
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template/page';
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (req) => {
  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('Payment received!', event.data.object?.id);
      const paymentData = event.data.object;
      const session_id = paymentData.id;
      const status = paymentData.payment_status; // 'paid' expected

      // update transaction status
      const result = await prisma.paymentTransaction.updateMany({
        where: { session_id },
        data: { status },
      });
      console.log(`Updated ${result.count} transaction(s) to status ${status}.`);

      // create booking if paid and metadata present
      if (status === 'paid') {
        const md = paymentData.metadata || {};
        try {
          if (md.slot && md.duration && md.massageType && md.name && md.email && md.phone) {
            const booking = await prisma.booking.create({
              data: {
                slot: new Date(md.slot),
                duration: Number(md.duration),
                massageType: md.massageType,
                name: md.name,
                email: md.email,
                phone: md.phone,
              }
            });

            // send email confirmation
            try {
              const slotLocal = new Date(md.slot).toLocaleString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
              });
              const price = md.price || '';
              await resend.emails.send({
                from: process.env.RESEND_FROM || 'lamoonThaispa <noreply@gucode.site>',
                to: [md.email],
                subject: 'Confirmation de réservation - lamoonThaispa',
                react: (
                  <EmailTemplate
                    firstName={md.name}
                    massageType={md.massageType}
                    duration={md.duration}
                    slot={slotLocal}
                    price={price}
                    orderId={md.order_id || ''}
                  />
                ),
              });
            } catch (mailErr) {
              console.error('Failed to send confirmation email:', mailErr);
            }
          }
        } catch (err) {
          console.error('Failed to create booking from webhook:', err);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};
