import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongoose"
import Product from "@/models/Product"
import { getCurrentUser } from "@/lib/auth"


export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const { products } = await req.json()

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid data format. Expected an array of products." }, { status: 400 })
    }

    const results = {
      total: products.length,
      success: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each product
    for (let i = 0; i < products.length; i++) {
      try {
        const product = products[i]

        // Map external product format to our schema
        const mappedProduct = mapProductData(product)

        // Validate required fields
        if (!mappedProduct.title) throw new Error(`Product at index ${i}: Title is required`)
        if (!mappedProduct.price) throw new Error(`Product at index ${i}: Price is required`)
        if (!mappedProduct.category) throw new Error(`Product at index ${i}: Category is required`)

        // Create the product
        await Product.create(mappedProduct)

        results.success++
      } catch (error) {
        results.failed++
        results.errors.push(error instanceof Error ? error.message : `Error importing product at index ${i}`)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error importing products:", error)
    return NextResponse.json({ error: "Failed to import products" }, { status: 500 })
  }
}

// Helper function to map external product data to our schema
function mapProductData(product: any) {
  // Calculate if product is on sale based on discount percentage
  const isSale = product.discountPercentage > 0

  // Map the external product format to our schema
  return {
    title: product.title || product.name, // Support both title and name
    description: product.description || "",
    shortDescription: product.shortDescription || "",
    price: Number(product.price) || 0,
    discountPercentage: Number(product.discountPercentage) || 0,
    category: product.category || "",
    brand: product.brand || "",
    thumbnail: product.thumbnail || product.image || "", // Support both thumbnail and image
    images: Array.isArray(product.images) ? product.images : product.gallery ? product.gallery : [],
    stock: Number(product.stock) || 0,
    sku: product.sku || "",
    availabilityStatus: product.availabilityStatus || "In Stock",
    minimumOrderQuantity: Number(product.minimumOrderQuantity) || 1,
    tags: Array.isArray(product.tags) ? product.tags : [],
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : [],
    material: product.material || "",
    weight: Number(product.weight) || null,
    dimensions: product.dimensions || {},
    warrantyInformation: product.warrantyInformation || "",
    shippingInformation: product.shippingInformation || "",
    returnPolicy: product.returnPolicy || "",
    careInstructions: product.careInstructions || "",
    isNew: Boolean(product.isNew),
    isSale: Boolean(isSale),
    isFeatured: Boolean(product.isFeatured),
    isBestSeller: Boolean(product.isBestSeller),
    rating: Number(product.rating) || 0,
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    meta: {
      createdAt: product.meta?.createdAt || new Date(),
      updatedAt: product.meta?.updatedAt || new Date(),
      barcode: product.meta?.barcode || "",
      qrCode: product.meta?.qrCode || "",
    },
  }
}
