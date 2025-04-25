import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()

    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const sort = searchParams.get("sort") || "relevance"
    const order = searchParams.get("order") || "desc"

    if (!query) {
      return NextResponse.json(
        {
          products: [],
          pagination: {
            total: 0,
            pages: 0,
            page: 1,
            limit,
          },
        },
        { status: 200 },
      )
    }

    // Build search query
    const searchQuery = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } }, // For backward compatibility
        { description: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
      ],
    }

    // Build sort options
    let sortOptions = {}

    if (sort === "relevance") {
      // For relevance sorting, we use text score if available, otherwise default to newest
      sortOptions = { createdAt: -1 }
    } else if (sort === "price") {
      sortOptions = { price: order === "asc" ? 1 : -1 }
    } else if (sort === "title" || sort === "name") {
      // Handle both title and name for backward compatibility
      if (sort === "title") {
        sortOptions = { title: order === "asc" ? 1 : -1 }
      } else {
        sortOptions = { name: order === "asc" ? 1 : -1 }
      }
    } else if (sort === "rating") {
      sortOptions = { rating: order === "asc" ? 1 : -1 }
    } else {
      // Default to newest
      sortOptions = { createdAt: -1 }
    }

    // Count total products
    const total = await Product.countDocuments(searchQuery)

    // Calculate pagination
    const skip = (page - 1) * limit
    const totalPages = Math.ceil(total / limit)

    // Fetch products
    const products = await Product.find(searchQuery).sort(sortOptions).skip(skip).limit(limit).lean()

    return NextResponse.json(
      {
        products,
        pagination: {
          total,
          pages: totalPages,
          page,
          limit,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
