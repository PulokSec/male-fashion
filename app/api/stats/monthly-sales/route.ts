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

    // Get current year
    const currentYear = new Date().getFullYear()

    // Aggregate monthly sales for the current year
    const monthlySales = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Map month numbers to month names and fill in missing months
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const formattedData = monthNames.map((name, index) => {
      const monthData = monthlySales.find((item) => item._id === index + 1)
      return {
        name,
        total: monthData ? Math.round(monthData.total) : 0,
      }
    })

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching monthly sales:", error)
    return NextResponse.json({ error: "Failed to fetch monthly sales" }, { status: 500 })
  }
}
