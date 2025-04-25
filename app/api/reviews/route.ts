import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Review from "@/models/Review"
import Product from "@/models/Product"

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const reviews = await Review.find({ productId }).sort({ createdAt: -1 })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase()

    const data = await req.json()

    if (!data.productId || !data.userName || !data.rating || !data.comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the review
    const review = await Review.create(data)

    // Update product rating
    const productId = data.productId
    const allReviews = await Review.find({ productId })
    const avgRating = allReviews.reduce((sum, item) => sum + item.rating, 0) / allReviews.length

    await Product.findByIdAndUpdate(productId, {
      rating: avgRating,
      numReviews: allReviews.length,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
