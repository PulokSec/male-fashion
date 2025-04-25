"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductCardSkeleton from "@/components/product-card-skeleton"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"

type Product = {
  _id: string
  title: string
  name?: string
  price: number
  discountPercentage: number
  salePrice?: number
  thumbnail: string
  image?: string
  images: string[]
  rating: number
  isNew?: boolean
  isSale?: boolean
  category: string
  brand: string
  stock: number
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOption, setSortOption] = useState("relevance")
  const { addItem } = useCart()

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return

      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append("q", query)
        params.append("page", currentPage.toString())
        params.append("limit", "12")

        if (sortOption !== "relevance") {
          const [sort, order] = sortOption.split("-")
          params.append("sort", sort)
          params.append("order", order || "desc")
        }

        const response = await fetch(`/api/search?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch search results")

        const data = await response.json()
        setProducts(data.products)
        setTotalProducts(data.pagination.total)
        setTotalPages(data.pagination.pages)
      } catch (error) {
        console.error("Error fetching search results:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, currentPage, sortOption])

  const handleAddToCart = (product: Product) => {
    addItem({
      _id: product._id,
      name: product.title || product.name || "",
      price: product.price,
      salePrice:
        product.salePrice ||
        (product.discountPercentage > 0 ? product.price * (1 - product.discountPercentage / 100) : null),
      image: product.thumbnail || product.image || product.images[0] || "/placeholder.svg",
    })
  }

  return (
    <div className="">
      <TopBar/>
      <Header/>
      <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Search Results: "{query}"</h1>

          <div className="flex items-center space-x-4">
            <Select value={sortOption} onValueChange={(value) => setSortOption(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="title-asc">Name: A to Z</SelectItem>
                <SelectItem value="title-desc">Name: Z to A</SelectItem>
                <SelectItem value="rating-desc">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try searching with different keywords</p>
            <Link href="/shop">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Found {totalProducts} product{totalProducts !== 1 ? "s" : ""} for "{query}"
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="group relative">
                  <Link href={`/shop/product/${product._id}`} className="block">
                    <div className="relative overflow-hidden bg-gray-100">
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 z-10">
                          NEW
                        </div>
                      )}
                      {(product.isSale || product.discountPercentage > 0) && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 z-10">
                          SALE
                        </div>
                      )}
                      <Image
                        src={product.thumbnail || product.image || product.images[0] || "/placeholder.svg"}
                        alt={product.title || product.name || "Product"}
                        width={300}
                        height={400}
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  <div className="mt-4">
                    <h3 className="font-medium">
                      <Link href={`/shop/product/${product._id}`}>{product.title || product.name}</Link>
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
                    <div className="flex justify-between items-center">
                      <div>
                        {product.discountPercentage > 0 ? (
                          <>
                            <span className="font-bold text-red-500 mr-2">
                              {formatCurrency(product.price * (1 - product.discountPercentage / 100))}
                            </span>
                            <span className="text-gray-500 line-through text-sm">{formatCurrency(product.price)}</span>
                          </>
                        ) : (
                          <span className="font-bold">{formatCurrency(product.price)}</span>
                        )}
                      </div>
                      <button
                        className="p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-colors"
                        onClick={() => handleAddToCart(product)}
                        aria-label="Add to cart"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </Button>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1
                    // Show first, last, current, and pages around current
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    } else if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return <span key={page}>...</span>
                    }
                    return null
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
    <Footer/>
    </div>
  )
}
