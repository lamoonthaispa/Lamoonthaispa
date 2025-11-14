import prisma from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where = {}
    if (from || to) {
      where.slot = {}
      if (from) where.slot.gte = new Date(from)
      if (to) where.slot.lte = new Date(to)
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { slot: 'asc' },
    })
    return new Response(JSON.stringify({ bookings }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('GET /api/bookings error:', err)
    return new Response(JSON.stringify({ error: process.env.NODE_ENV === 'development' ? (err?.message || 'Failed to load bookings') : 'Failed to load bookings' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { slot, duration, massageType, name, email, phone, notes } = body || {}

    if (!slot || !duration || !massageType || !name || !email || !phone) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const created = await prisma.booking.create({
      data: {
        slot: new Date(slot),
        duration: Number(duration),
        massageType,
        name,
        email,
        phone,
        notes: notes || null,
      },
    })

    return new Response(JSON.stringify({ booking: created }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('POST /api/bookings error:', err)
    return new Response(JSON.stringify({ error: process.env.NODE_ENV === 'development' ? (err?.message || 'Failed to create booking') : 'Failed to create booking' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}


