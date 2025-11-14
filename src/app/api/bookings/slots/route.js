import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    const where = {}
    if (start || end) {
      where.slot = {}
      if (start) where.slot.gte = new Date(start)
      if (end) where.slot.lte = new Date(end)
    }

    // fetch bookings in range (include duration so frontend can compute overlaps)
    const bookings = await prisma.booking.findMany({
      where,
      select: { slot: true, duration: true },
      orderBy: { slot: 'asc' },
    })

    // return raw bookings array: [{ slot, duration }, ...]
    return new Response(JSON.stringify(bookings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('GET /api/bookings/slots error:', err)
    return new Response(JSON.stringify({ error: process.env.NODE_ENV === 'development' ? (err?.message || 'Failed to load slot counts') : 'Failed to load slot counts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
