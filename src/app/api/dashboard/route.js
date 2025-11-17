import prisma from '@/lib/prisma'

export async function GET(req) {
  try {
    // Fetch all bookings with their optional PaymentTransaction
    const bookings = await prisma.booking.findMany({
      orderBy: { slot: 'asc' },
      include: {
        paymentTransaction: true,
      },
    });

    // Map to clean JSON structure for frontend / Apps Script
    const response = bookings.map(b => ({
      id: b.id,
      slot: b.slot.toISOString(),      // convert DateTime to string
      duration: b.duration,
      massageType: b.massageType,
      name: b.name,
      email: b.email,
      phone: b.phone,
      notes: b.notes || '',
      paymentStatus: b.paymentTransaction?.status || 'Complete',
      orderId: b.paymentTransaction?.order_id || 'Complete',
    }));

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch bookings' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
