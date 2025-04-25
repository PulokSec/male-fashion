import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Product from "@/models/Product"
import { getCurrentUser } from "@/lib/auth"


export async function GET(req: NextRequest) {
  try {
    await connectToDatabase()

    const { searchParams } = new URL(req.url)

    // Pagination
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    // Filtering
    const category = searchParams.get("category")
    const brand = searchParams.get("brand")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const colors = searchParams.get("colors")?.split(",")
    const sizes = searchParams.get("sizes")?.split(",")
    const isNew = searchParams.get("isNew")
    const isSale = searchParams.get("isSale")
    const isFeatured = searchParams.get("isFeatured")
    const isBestSeller = searchParams.get("isBestSeller")
    const inStock = searchParams.get("inStock")

    // Sorting
    const sort = searchParams.get("sort") || "createdAt"
    const order = searchParams.get("order") || "desc"

    // Search
    const search = searchParams.get("search")

    // Build query
    const query: any = {}

    if (category) query.category = category
    if (brand) query.brand = brand
    if (minPrice) query.price = { ...query.price, $gte: Number.parseFloat(minPrice) }
    if (maxPrice) query.price = { ...query.price, $lte: Number.parseFloat(maxPrice) }
    if (colors) query.colors = { $in: colors }
    if (sizes) query.sizes = { $in: sizes }
    if (isNew === "true") query.isNew = true
    if (isSale === "true") query.isSale = true
    if (isFeatured === "true") query.isFeatured = true
    if (isBestSeller === "true") query.isBestSeller = true
    if (inStock === "true") query.stock = { $gt: 0 }

    // Search query
    if (search) {
      query.$text = { $search: search }
    }

    // Build sort
    const sortOptions: any = {}
    sortOptions[sort] = order === "asc" ? 1 : -1

    // If searching, add text score to sort
    if (search) {
      sortOptions.score = { $meta: "textScore" }
    }

    // Count total documents for pagination
    const total = await Product.countDocuments(query)

    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select(search ? { score: { $meta: "textScore" } } : {})

    // Return with pagination metadata
    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
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

    // Set isSale based on discountPercentage or salePrice
    if ((data.discountPercentage && data.discountPercentage > 0) || (data.salePrice && data.salePrice < data.price)) {
      data.isSale = true
    }

    const product = await Product.create(data)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
