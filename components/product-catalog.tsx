"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, RefreshCw, Search, ShoppingBag, Star, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/lib/cart-context"
import ProductCardSkeleton from "@/components/product-card-skeleton"

type Product = {
  _id: string
  title: string
  price: number
  discountPercentage?: number
  thumbnail: string
  rating: number
  stock: number
  isNew?: boolean
  isBestSeller?: boolean
}

export default function ProductCatalog() {
  const [activeTab, setActiveTab] = useState("best-sellers")
  const [zoomView, setZoomView] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addItem } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)

      try {
        // Build query parameters based on active tab
        const queryParams = new URLSearchParams()
        queryParams.append("limit", "8") // Limit to 8 products

        if (activeTab === "best-sellers") {
          queryParams.append("isBestSeller", "true")
        } else if (activeTab === "new-arrivals") {
          queryParams.append("isNew", "true")
        } else if (activeTab === "hot-sales") {
          queryParams.append("discountPercentage", "gt:0")
        }

        const response = await fetch(`/api/products?${queryParams.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data.products)
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [activeTab])

  const calculateSalePrice = (price: number, discountPercentage?: number) => {
    if (!discountPercentage) return null
    return price - (price * discountPercentage) / 100
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const salePrice = calculateSalePrice(product.price, product.discountPercentage)

    addItem({
      _id: product._id,
      name: product.title,
      price: product.price,
      salePrice: salePrice,
      image: product.thumbnail,
    })
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-12">
          <div className="inline-flex border-b">
            <button
              className={`px-8 py-4 text-lg font-medium transition-all duration-300 ${
                activeTab === "best-sellers" ? "text-black" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("best-sellers")}
            >
              Best Sellers
            </button>
            <button
              className={`px-8 py-4 text-lg font-medium transition-all duration-300 ${
                activeTab === "new-arrivals" ? "text-black" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("new-arrivals")}
            >
              New Arrivals
            </button>
            <button
              className={`px-8 py-4 text-lg font-medium transition-all duration-300 ${
                activeTab === "hot-sales" ? "text-black" : "text-gray-400"
              }`}
              onClick={() => setActiveTab("hot-sales")}
            >
              Hot Sales
            </button>
          </div>
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded"
              onClick={() => setActiveTab(activeTab)} // Re-fetch by "clicking" the same tab
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found in this category.</p>
            <Link href="/shop" className="mt-4 inline-block bg-black text-white px-6 py-2">
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onZoomView={() => setZoomView(product)}
                onAddToCart={handleAddToCart}
                calculateSalePrice={calculateSalePrice}
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {zoomView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomView(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl w-full bg-white p-4 rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 bg-black text-white rounded-full p-1"
                onClick={() => setZoomView(null)}
              >
                <X size={20} />
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={zoomView.thumbnail || "/placeholder.svg"}
                    alt={zoomView.title}
                    width={600}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-2">{zoomView.title}</h3>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < zoomView.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <div className="mb-4">
                    {zoomView.discountPercentage ? (
                      <>
                        <span className="text-xl font-bold text-red-500 mr-2">
                          ${calculateSalePrice(zoomView.price, zoomView.discountPercentage)?.toFixed(2)}
                        </span>
                        <span className="text-gray-500 line-through">${zoomView.price.toFixed(2)}</span>
                        <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded">
                          {zoomView.discountPercentage.toFixed(0)}% OFF
                        </span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">${zoomView.price.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="mb-2 text-sm">
                    <span className={zoomView.stock > 0 ? "text-green-600" : "text-red-600"}>
                      {zoomView.stock > 0 ? `In Stock (${zoomView.stock})` : "Out of Stock"}
                    </span>
                  </div>
                  <Link href={`/shop/product/${zoomView._id}`} className="mb-6">
                    <button className="bg-gray-200 text-black py-2 px-6 w-full">VIEW DETAILS</button>
                  </Link>
                  <button
                    className="bg-black text-white py-3 px-6 flex items-center justify-center"
                    onClick={(e) => handleAddToCart(zoomView, e)}
                    disabled={zoomView.stock <= 0}
                  >
                    <ShoppingBag size={18} className="mr-2" />
                    ADD TO CART
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

function ProductCard({
  product,
  onZoomView,
  onAddToCart,
  calculateSalePrice,
}: {
  product: Product
  onZoomView: () => void
  onAddToCart: (product: Product, e: React.MouseEvent) => void
  calculateSalePrice: (price: number, discountPercentage?: number) => number | null
}) {
  const [isHovered, setIsHovered] = useState(false)
  const salePrice = calculateSalePrice(product.price, product.discountPercentage)

  return (
    <motion.div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Link href={`/shop/product/${product._id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100">
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 z-10">NEW</div>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 z-10">
              {product.discountPercentage.toFixed(0)}% OFF
            </div>
          )}
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            width={300}
            height={400}
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
          />

          <AnimatePresence>
            {isHovered && (
              <>
                <motion.div
                  className="absolute right-4 top-4 flex flex-col gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <Heart size={18} />
                  </button>
                  <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors">
                    <RefreshCw size={18} />
                  </button>
                  <button
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                      onZoomView()
                    }}
                  >
                    <Search size={18} />
                  </button>
                </motion.div>

                <motion.div
                  className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white py-3 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    className="font-medium flex items-center justify-center w-full"
                    onClick={(e) => onAddToCart(product, e)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </Link>

      <div className="mt-4">
        <h3 className="font-medium">
          <Link href={`/shop/product/${product._id}`}>{product.title}</Link>
        </h3>
        <div className="flex my-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
        <div>
          {salePrice ? (
            <>
              <span className="font-bold text-red-500 mr-2">${salePrice.toFixed(2)}</span>
              <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
