import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Deal from "@/models/Deal"
import { getCurrentUser } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    await connectToDatabase()

    const deal = await Deal.findById(id)

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error fetching deal:", error)
    return NextResponse.json({ error: "Failed to fetch deal" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const user = await getCurrentUser(req)
    
        if (!user?.isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

    await connectToDatabase()

    const data = await req.json()

    // Validate input
    if (!data.productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    if (data.discountPercentage < 1 || data.discountPercentage > 99) {
      return NextResponse.json({ error: "Discount percentage must be between 1 and 99" }, { status: 400 })
    }

    if (!data.startDate || !data.endDate) {
      return NextResponse.json({ error: "Start and end dates are required" }, { status: 400 })
    }

    if (new Date(data.endDate) <= new Date(data.startDate)) {
      return NextResponse.json({ error: "End date must be after start date" }, { status: 400 })
    }

    const deal = await Deal.findByIdAndUpdate(
      id,
      {
        productId: data.productId,
        discountPercentage: data.discountPercentage,
        startDate: data.startDate,
        endDate: data.endDate,
        featured: data.featured || false,
      },
      { new: true, runValidators: true },
    )

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    console.error("Error updating deal:", error)
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
    const user = await getCurrentUser(req)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const deal = await Deal.findByIdAndDelete(id)

    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Deal deleted successfully" })
  } catch (error) {
    console.error("Error deleting deal:", error)
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 })
  }
}
