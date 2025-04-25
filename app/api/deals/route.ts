import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Deal from "@/models/Deal"
import Product from "@/models/Product"
import { getCurrentUser } from "@/lib/auth"


export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get("active") === "true"
    const featured = searchParams.get("featured") === "true"

    // Build query based on parameters
    let query: any = {}

    // If active=true, only return deals that are currently active
    if (active) {
      const now = new Date()
      query = {
        startDate: { $lte: now },
        endDate: { $gte: now },
      }
    }

    // If featured=true, only return featured deals
    if (featured) {
      query.featured = true
    }

    // Get all deals with product details
    const deals = await Deal.find(query).sort({ featured: -1, endDate: 1 }).lean()

    // Fetch product details for each deal
    const dealsWithProducts = await Promise.all(
      deals.map(async (deal) => {
        const product = await Product.findById(deal.productId).lean() as {
          _id: string;
          title: string;
          price: number;
          discountPercentage?: number;
          thumbnail: string;
          images: string[];
          category: string;
          stock: number;
        } | null
        if (!product) return null

        return {
          _id: deal._id,
          title: product.title,
          price: product.price,
          discountPercentage: deal.discountPercentage || product.discountPercentage,
          thumbnail: product.thumbnail,
          images: product.images,
          startDate: deal.startDate,
          endDate: deal.endDate,
          category: product.category,
          stock: product.stock,
          featured: deal.featured || false,
          productId: product._id,
        }
      }),
    )

    // Filter out null values (deals with no associated product)
    const validDeals = dealsWithProducts.filter((deal) => deal !== null)

    return NextResponse.json(validDeals)
  } catch (error) {
    console.error("Error fetching deals:", error)
    return NextResponse.json({ error: "Failed to fetch deals" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const data = await req.json()
    const deal = await Deal.create(data)

    return NextResponse.json(deal, { status: 201 })
  } catch (error) {
    console.error("Error creating deal:", error)
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 })
  }
}
