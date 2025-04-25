import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Order from "@/models/Order"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Get 5 most recent paid orders
    const recentSales = await Order.find({ paymentStatus: "paid" })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .lean()

    return NextResponse.json(recentSales)
  } catch (error) {
    console.error("Error fetching recent sales:", error)
    return NextResponse.json({ error: "Failed to fetch recent sales" }, { status: 500 })
  }
}
