import { EmailTemplate } from '@/components/email-template/page';
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      to = [],
      subject = 'Confirmation de réservation - lamoonThaispa',
      firstName = '',
      massageType = '',
      duration = '',
      slot = '',
      price = '',
      orderId = '',
    } = body || {};

    const data = await resend.emails.send({
      from: process.env.RESEND_FROM || 'lamoonThaispa <noreply@gucode.site>',
      to: Array.isArray(to) ? to : [to],
      subject,
      react: (
        <EmailTemplate
          firstName={firstName}
          massageType={massageType}
          duration={duration}
          slot={slot}
          price={price}
          orderId={orderId}
        />
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
