"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Minus, Plus, Star, Truck, Shield, RotateCcw } from "lucide-react"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCart } from "@/lib/cart-context"
import { useParams } from "next/navigation"

type TabType = "description" | "reviews" | "additional" | "shipping"

type Product = {
  _id: string
  title: string
  description: string
  shortDescription: string
  price: number
  discountPercentage: number
  salePrice: number | null
  thumbnail: string
  images: string[]
  category: string
  brand: string
  tags: string[]
  colors: string[]
  sizes: string[]
  material: string
  weight: number
  dimensions: {
    width: number
    height: number
    depth: number
  }
  stock: number
  warrantyInformation: string
  shippingInformation: string
  returnPolicy: string
  availabilityStatus: string
  minimumOrderQuantity: number
  careInstructions: string
  isNew: boolean
  isSale: boolean
  rating: number
  reviews: {
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
  }[]
  sku: string
  meta: {
    barcode: string
    qrCode: string
    createdAt: string
    updatedAt: string
  }
}

export default function ProductDetailPage() {
  const [activeTab, setActiveTab] = useState<TabType>("description")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { id } = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (!response.ok) throw new Error("Failed to fetch product")

        const data = await response.json()
        setProduct(data.product)

        // Set default selected color and size if available
        if (data.product.colors.length > 0) {
          setSelectedColor(data.product.colors[0])
        }

        if (data.product.sizes.length > 0) {
          setSelectedSize(data.product.sizes[0])
        }

        // Set minimum quantity
        if (data.product.minimumOrderQuantity > 1) {
          setQuantity(data.product.minimumOrderQuantity)
        }

        // Fetch related products
        const relatedResponse = await fetch(`/api/products?category=${data.product.category}&limit=4`)
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json()
          // Filter out the current product
          setRelatedProducts(relatedData.products.filter((p: Product) => p._id !== id).slice(0, 4))
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > (product?.minimumOrderQuantity || 1)) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!product) return

    addItem({
      _id: product._id,
      name: product.title,
      price: product.price,
      salePrice: product.salePrice,
      image: product.thumbnail || product.images[0],
    })
  }

  const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
    return (price * (1 - discountPercentage / 100)).toFixed(2)
  }

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="bg-[#f8f7f3] pb-16">
          <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
              <Skeleton className="h-6 w-48" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              <div className="flex">
                <div className="hidden md:flex flex-col space-y-4 mr-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <Skeleton key={index} className="w-16 h-20" />
                  ))}
                </div>
                <Skeleton className="flex-1 h-[600px]" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-40" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!product) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="bg-[#f8f7f3] pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-8">The product you are looking for does not exist or has been removed.</p>
            <Link href="/shop">
              <Button>Return to Shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-[#f8f7f3] pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="text-sm text-gray-500">
              <Link href="/" className="hover:text-black">
                Home
              </Link>{" "}
              &gt;{" "}
              <Link href="/shop" className="hover:text-black">
                Shop
              </Link>{" "}
              &gt;{" "}
              <Link href={`/shop?category=${product.category}`} className="hover:text-black">
                {product.category}
              </Link>{" "}
              &gt; {product.title}
            </div>
          </div>

          {/* Product Gallery and Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Gallery */}
            <div className="flex">
              {/* Thumbnails */}
              <div className="hidden md:flex flex-col space-y-4 mr-4">
                {[product.thumbnail, ...product.images].filter(Boolean).map((image, index) => (
                  <button
                    key={index}
                    className={`border ${
                      activeImage === index ? "border-black" : "border-gray-200"
                    } w-16 h-20 overflow-hidden`}
                    onClick={() => setActiveImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Product thumbnail ${index + 1}`}
                      width={64}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-white">
                <Image
                  src={[product.thumbnail, ...product.images].filter(Boolean)[activeImage] || "/placeholder.svg"}
                  alt={product.title}
                  width={600}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Product Info */}
            <div>
              {product.brand && <div className="text-gray-500 text-sm uppercase mb-1">{product.brand}</div>}
              <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">{product.reviews?.length || 0} Reviews</span>
              </div>

              <div className="mb-6">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-2xl font-bold mr-3">
                      ${calculateDiscountedPrice(product.price, product.discountPercentage)}
                    </span>
                    <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>

              <p className="text-gray-600 mb-8">{product.shortDescription || product.description.substring(0, 150)}</p>

              {/* Availability Status */}
              <div className="mb-4">
                <span className="font-medium">Availability: </span>
                <span className={product.availabilityStatus === "In Stock" ? "text-green-600" : "text-red-600"}>
                  {product.availabilityStatus}
                </span>
                {product?.stock > 0 && <span className="ml-2 text-sm text-gray-500">({product?.stock} items left)</span>}
              </div>

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Size:</span>
                  </div>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`w-10 h-10 flex items-center justify-center border ${
                          selectedSize === size ? "border-black bg-black text-white" : "border-gray-300"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Color:</span>
                  </div>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full ${
                          selectedColor === color ? "ring-2 ring-offset-2 ring-black" : ""
                        }`}
                        style={{ backgroundColor: color.startsWith("#") ? color : undefined }}
                        onClick={() => setSelectedColor(color)}
                        aria-label={color}
                      >
                        {!color.startsWith("#") && <span className="text-xs">{color.substring(0, 2)}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300">
                  <button
                    className="w-10 h-10 flex items-center justify-center border-r border-gray-300"
                    onClick={decrementQuantity}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 h-10 flex items-center justify-center">{quantity}</span>
                  <button
                    className="w-10 h-10 flex items-center justify-center border-l border-gray-300"
                    onClick={incrementQuantity}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button
                  className="bg-black text-white px-6 py-3 uppercase font-medium text-sm"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </button>
              </div>

              {/* Minimum Order Quantity */}
              {product.minimumOrderQuantity > 1 && (
                <div className="mb-4 text-sm text-gray-600">
                  <span className="font-medium">Minimum Order Quantity: </span>
                  {product.minimumOrderQuantity} items
                </div>
              )}

              {/* Add to Wishlist */}
              <button className="flex items-center text-sm font-medium mb-8">
                <Heart size={16} className="mr-2" />
                ADD TO WISHLIST
              </button>

              {/* Product Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-sm">Free shipping over $50</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-sm">{product.warrantyInformation || "Quality Guarantee"}</span>
                </div>
                <div className="flex items-center">
                  <RotateCcw className="h-5 w-5 mr-2 text-gray-600" />
                  <span className="text-sm">{product.returnPolicy || "Easy Returns"}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="text-sm text-gray-600 mb-4">
                <p className="mb-1">SKU: {product.sku}</p>
                <p className="mb-1">Category: {product.category}</p>
                <p className="mb-1">Brand: {product.brand}</p>
                {product.tags.length > 0 && <p>Tags: {product.tags.join(", ")}</p>}
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mb-16">
            <div className="flex border-b mb-8 overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === "description" ? "border-b-2 border-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === "additional" ? "border-b-2 border-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("additional")}
              >
                Additional Information
              </button>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === "reviews" ? "border-b-2 border-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({product.reviews?.length || 0})
              </button>
              <button
                className={`px-6 py-3 font-medium whitespace-nowrap ${
                  activeTab === "shipping" ? "border-b-2 border-black" : "text-gray-500"
                }`}
                onClick={() => setActiveTab("shipping")}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="prose max-w-none">
              {activeTab === "description" && (
                <div>
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
              )}

              {activeTab === "additional" && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Additional Information</h3>
                  <table className="w-full border-collapse">
                    <tbody>
                      {product.weight && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Weight</td>
                          <td className="py-3">{product.weight} g</td>
                        </tr>
                      )}
                      {product.dimensions && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Dimensions</td>
                          <td className="py-3">
                            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                          </td>
                        </tr>
                      )}
                      {product.sizes.length > 0 && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Size</td>
                          <td className="py-3">{product.sizes.join(", ")}</td>
                        </tr>
                      )}
                      {product.colors.length > 0 && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Color</td>
                          <td className="py-3">{product.colors.join(", ")}</td>
                        </tr>
                      )}
                      {product.material && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Material</td>
                          <td className="py-3">{product.material}</td>
                        </tr>
                      )}
                      {product.brand && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Brand</td>
                          <td className="py-3">{product.brand}</td>
                        </tr>
                      )}
                      {product.meta?.barcode && (
                        <tr className="border-b">
                          <td className="py-3 font-medium">Barcode</td>
                          <td className="py-3">{product.meta.barcode}</td>
                        </tr>
                      )}
                      {product.careInstructions && (
                        <tr>
                          <td className="py-3 font-medium">Care Instructions</td>
                          <td className="py-3">{product.careInstructions}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <div className="mb-8">
                    <h3 className="text-lg font-bold mb-4">Customer Reviews</h3>
                    <div className="flex items-center mb-2">
                      <div className="flex mr-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <span className="text-sm">Based on {product.reviews?.length || 0} reviews</span>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review, index) => (
                        <div key={index} className="border-b pb-6">
                          <div className="flex items-center mb-2">
                            <div className="flex mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  className={
                                    star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="font-medium">{review.reviewerName}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            Posted on {new Date(review.date).toLocaleDateString()}
                          </p>
                          <p>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}

              {activeTab === "shipping" && (
                <div>
                  <h3 className="text-lg font-bold mb-4">Shipping Information</h3>
                  <p className="mb-4">{product.shippingInformation || "Standard shipping takes 3-5 business days."}</p>

                  <h3 className="text-lg font-bold mb-4">Return Policy</h3>
                  <p>{product.returnPolicy || "Returns accepted within 30 days of purchase."}</p>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-center">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <div key={product._id} className="group">
                    <div className="relative bg-gray-100 mb-4 overflow-hidden">
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 z-10">
                          SALE
                        </div>
                      )}
                      <Link href={`/shop/product/${product._id}`}>
                        <Image
                          src={product.thumbnail || product.images?.[0] || "/placeholder.svg"}
                          alt={product.title}
                          width={300}
                          height={300}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </Link>
                    </div>
                    <h3 className="font-medium mb-1">
                      <Link href={`/shop/product/${product._id}`}>{product.title}</Link>
                    </h3>
                    <div className="flex items-center">
                      {product.discountPercentage > 0 ? (
                        <>
                          <span className="font-bold text-red-500">
                            ${calculateDiscountedPrice(product.price, product.discountPercentage)}
                          </span>
                          <span className="ml-2 text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-bold">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
