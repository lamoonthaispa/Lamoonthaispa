import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req) {
  const { v4: uuidv4 } = require('uuid');
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  // อ่านข้อมูลจาก body
  const { user, product, booking, returnUrl } = await req.json();

  const order_id = uuidv4();

  // ฟังก์ชันช่วยสำหรับแปลง object เป็น query string
  function toQueryString(obj) {
    return Object.entries(obj || {})
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
  }

  // สร้าง query string สำหรับ booking
  const bookingParams = toQueryString({
    slot: booking?.slot,
    duration: booking?.duration,
    massageType: booking?.massageType,
    name: booking?.name,
    email: booking?.email,
    phone: booking?.phone
  });

  // เตรียม URL
  const baseUrl = returnUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const successUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}checkout_result=success&order_id=${order_id}&${bookingParams}`;
  const cancelUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}checkout_result=cancel&order_id=${order_id}`;

  try {
    // สร้าง Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: { name: product.name },
            unit_amount: product.price * 100,
          },
          quantity: product.quantity,
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        slot: booking?.slot || '',
        duration: String(booking?.duration || ''),
        massageType: booking?.massageType || '',
        name: booking?.name || user?.fullname || '',
        email: booking?.email || '',
        phone: booking?.phone || '',
        price: String(product?.price || ''),
        order_id,
      }
    });

    console.log("Checkout Session:", session.id);

    // บันทึก transaction ในฐานข้อมูล (non-fatal)
    try {
      await prisma.paymentTransaction.create({
        data: {
          fullname: user.fullname,
          address: user.address,
          order_id,
          session_id: session.id,
          status: 'open'
        }
      });
    } catch (dbErr) {
      console.error('Failed to persist payment transaction (non-fatal):', dbErr);
    }

    return Response.json({
      success: true,
      order_id,
      session_id: session.id,
      client_secret: session.client_secret,
      url: session.url,
    });

  } catch (error) {
    console.error("Error creating Stripe Checkout Session:", error);
    return Response.json({ success: false, message: 'Failed to create session' }, { status: 500 });
  }
}
