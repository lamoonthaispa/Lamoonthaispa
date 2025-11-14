//recently added please make sure this route work well with the booking calendar
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  // ✅ params ไม่ต้อง await เพราะมันไม่ใช่ Promise
  const { id } = await params;

  try {
    const order = await prisma.paymentTransaction.findFirst({ where: { order_id: id } });

    return Response.json({ success: true, order });

  } catch (error) {
    console.error("Error fetching order:", error);
    // ✅ ส่ง error response กลับไปด้วย
    return Response.json({
      success: false,
      message: "Error fetching order",
      error: error.message,
    }, { status: 500 });
  }
}
