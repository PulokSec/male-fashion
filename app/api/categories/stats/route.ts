import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET() {
  try {
    await connectToDatabase()

    // Get product counts by category
    const categoryCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Get available colors across all products
    const colors = await Product.distinct("colors")

    // Get available sizes across all products
    const sizes = await Product.distinct("sizes")

    // Get price range
    const priceStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ])

    return NextResponse.json({
      categories: categoryCounts,
      colors,
      sizes,
      priceRange: priceStats[0] || { minPrice: 0, maxPrice: 1000 },
    })
  } catch (error) {
    console.error("Error fetching category stats:", error)
    return NextResponse.json({ error: "Failed to fetch category stats" }, { status: 500 })
  }
}
