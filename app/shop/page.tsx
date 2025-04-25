"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Heart, RefreshCw, Search, ShoppingBag, Star, Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import ProductCardSkeleton from "@/components/product-card-skeleton"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import Header from "@/components/header"
import TopBar from "@/components/top-bar"
import Footer from "@/components/footer"

type Product = {
  _id: string
  title: string
  price: number
  salePrice: number | null
  thumbnail: string
  rating: number
  isNew?: boolean
  isSale?: boolean
}

type CategoryStat = {
  _id: string
  count: number
}

type FilterState = {
  category: string
  minPrice: number
  maxPrice: number
  colors: string[]
  sizes: string[]
  isNew: boolean
  isSale: boolean
  sort: string
  page: number
}

export default function ShopPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [zoomView, setZoomView] = useState<Product | null>(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [categories, setCategories] = useState<CategoryStat[]>([])
  const [availableColors, setAvailableColors] = useState<string[]>([])
  const [availableSizes, setAvailableSizes] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { addItem } = useCart()

  const [filters, setFilters] = useState<FilterState>({
    category: searchParams.get("category") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 1000,
    colors: searchParams.get("colors")?.split(",") || [],
    sizes: searchParams.get("sizes")?.split(",") || [],
    isNew: searchParams.get("isNew") === "true",
    isSale: searchParams.get("isSale") === "true",
    sort: searchParams.get("sort") || "createdAt",
    page: Number(searchParams.get("page")) || 1,
  })

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")

  // Fetch filter options (categories, colors, sizes, price range)
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const response = await fetch("/api/categories/stats")
        if (!response.ok) throw new Error("Failed to fetch filter options")

        const data = await response.json()
        setCategories(data.categories)
        setAvailableColors(data.colors)
        setAvailableSizes(data.sizes)
        setPriceRange({
          min: data.priceRange.minPrice,
          max: data.priceRange.maxPrice,
        })

        // Initialize max price if not set
        if (!filters.maxPrice) {
          setFilters((prev) => ({
            ...prev,
            maxPrice: data.priceRange.maxPrice,
          }))
        }
      } catch (error) {
        console.error("Error fetching filter options:", error)
      }
    }

    fetchFilterOptions()
  }, [])

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      try {
        // Build query string from filters
        const params = new URLSearchParams()

        if (filters.category) params.append("category", filters.category)
        if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString())
        if (filters.maxPrice < priceRange.max) params.append("maxPrice", filters.maxPrice.toString())
        if (filters.colors.length > 0) params.append("colors", filters.colors.join(","))
        if (filters.sizes.length > 0) params.append("sizes", filters.sizes.join(","))
        if (filters.isNew) params.append("isNew", "true")
        if (filters.isSale) params.append("isSale", "true")
        if (filters.sort) {
          const [sort, order] = filters.sort.split("-")
          params.append("sort", sort)
          params.append("order", order || "desc")
        }
        params.append("page", filters.page.toString())
        params.append("limit", "12")

        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/products?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch products")

        const data = await response.json()
        setProducts(data.products)
        setTotalProducts(data.pagination.total)
        setTotalPages(data.pagination.pages)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Update URL with filters
    const params = new URLSearchParams()
    if (filters.category) params.append("category", filters.category)
    if (filters.minPrice > 0) params.append("minPrice", filters.minPrice.toString())
    if (filters.maxPrice < priceRange.max) params.append("maxPrice", filters.maxPrice.toString())
    if (filters.colors.length > 0) params.append("colors", filters.colors.join(","))
    if (filters.sizes.length > 0) params.append("sizes", filters.sizes.join(","))
    if (filters.isNew) params.append("isNew", "true")
    if (filters.isSale) params.append("isSale", "true")
    if (filters.sort) params.append("sort", filters.sort)
    if (filters.page > 1) params.append("page", filters.page.toString())
    if (searchQuery) params.append("search", searchQuery)

    router.push(`/shop?${params.toString()}`, { scroll: false })
  }, [filters, searchQuery])

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Reset to page 1 when filters change
      page: key === "page" ? value : 1,
    }))
  }

  const toggleColorFilter = (color: string) => {
    setFilters((prev) => {
      const colors = prev.colors.includes(color) ? prev.colors.filter((c) => c !== color) : [...prev.colors, color]

      return {
        ...prev,
        colors,
        page: 1,
      }
    })
  }

  const toggleSizeFilter = (size: string) => {
    setFilters((prev) => {
      const sizes = prev.sizes.includes(size) ? prev.sizes.filter((s) => s !== size) : [...prev.sizes, size]

      return {
        ...prev,
        sizes,
        page: 1,
      }
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Reset page when searching
    setFilters((prev) => ({ ...prev, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      minPrice: 0,
      maxPrice: priceRange.max,
      colors: [],
      sizes: [],
      isNew: false,
      isSale: false,
      sort: "createdAt",
      page: 1,
    })
    setSearchQuery("")
  }

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      _id: product._id,
      name: product.title,
      price: product.salePrice || product.price,
      salePrice: product.salePrice,
      image: product.thumbnail,
    })
  }

  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="all-categories"
              checked={!filters.category}
              onCheckedChange={() => handleFilterChange("category", "")}
            />
            <Label htmlFor="all-categories" className="ml-2">
              All Categories
            </Label>
          </div>

          {categories.map((cat) => (
            <div key={cat._id} className="flex items-center">
              <Checkbox
                id={`category-${cat._id}`}
                checked={filters.category === cat._id}
                onCheckedChange={() => handleFilterChange("category", cat._id)}
              />
              <Label htmlFor={`category-${cat._id}`} className="ml-2">
                {cat._id} ({cat.count})
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            defaultValue={[filters.minPrice, filters.maxPrice]}
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            onValueChange={(value) => {
              handleFilterChange("minPrice", value[0])
              handleFilterChange("maxPrice", value[1])
            }}
            className="mb-4"
          />
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(filters.minPrice)}</span>
            <span>{formatCurrency(filters.maxPrice)}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Colors</h3>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((color) => (
            <button
              key={color}
              className={`w-8 h-8 rounded-full border-2 ${
                filters.colors.includes(color) ? "border-black" : "border-transparent"
              }`}
              style={{ backgroundColor: color.startsWith("#") ? color : undefined }}
              onClick={() => toggleColorFilter(color)}
              aria-label={color}
            >
              {!color.startsWith("#") && <span className="text-xs">{color.substring(0, 2)}</span>}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sizes</h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              className={`w-10 h-10 flex items-center justify-center border ${
                filters.sizes.includes(size) ? "bg-black text-white" : "border-gray-300"
              }`}
              onClick={() => toggleSizeFilter(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Product Status</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Checkbox
              id="new-products"
              checked={filters.isNew}
              onCheckedChange={(checked) => handleFilterChange("isNew", checked)}
            />
            <Label htmlFor="new-products" className="ml-2">
              New Products
            </Label>
          </div>
          <div className="flex items-center">
            <Checkbox
              id="sale-products"
              checked={filters.isSale}
              onCheckedChange={(checked) => handleFilterChange("isSale", checked)}
            />
            <Label htmlFor="sale-products" className="ml-2">
              Sale Products
            </Label>
          </div>
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear Filters
      </Button>
    </div>
  )

  return (
    <section className=" bg-white">
      <TopBar />
      <Header/>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Shop</h1>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Input
                type="search"
                placeholder="Search products..."
                className="w-64 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-2" aria-label="Search">
                              <Search size={18}/>
                            </button>
            </form>

            <Select value={filters.sort} onValueChange={(value) => handleFilterChange("sort", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="rating-desc">Top Rated</SelectItem>
              </SelectContent>
            </Select>

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter size={18} className="mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>Narrow down products by applying filters</SheetDescription>
                </SheetHeader>
                <div className="py-4">{renderFilters()}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="md:hidden mb-6">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2" aria-label="Search">
              <Search size={18} />
            </button>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-8 mb-14">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 shrink-0">{renderFilters()}</div>

          {/* Products */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-500">
                  Showing {(filters.page - 1) * 12 + 1}-{Math.min(filters.page * 12, totalProducts)} of {totalProducts}{" "}
                  products
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      onZoomView={() => setZoomView(product)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
                        disabled={filters.page === 1}
                      >
                        <ChevronLeft size={16} />
                      </Button>

                      {Array.from({ length: totalPages }).map((_, i) => {
                        const page = i + 1
                        // Show first, last, current, and pages around current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= filters.page - 1 && page <= filters.page + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={filters.page === page ? "default" : "outline"}
                              size="icon"
                              onClick={() => handleFilterChange("page", page)}
                            >
                              {page}
                            </Button>
                          )
                        } else if (
                          (page === 2 && filters.page > 3) ||
                          (page === totalPages - 1 && filters.page < totalPages - 2)
                        ) {
                          return <span key={page}>...</span>
                        }
                        return null
                      })}

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFilterChange("page", Math.min(totalPages, filters.page + 1))}
                        disabled={filters.page === totalPages}
                      >
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
                    {zoomView.salePrice ? (
                      <>
                        <span className="text-xl font-bold text-red-500 mr-2">
                          {formatCurrency(zoomView.salePrice)}
                        </span>
                        <span className="text-gray-500 line-through">{formatCurrency(zoomView.price)}</span>
                      </>
                    ) : (
                      <span className="text-xl font-bold">{formatCurrency(zoomView.price)}</span>
                    )}
                  </div>
                  <Link href={`/shop/product/${zoomView._id}`} className="mb-6">
                    <Button className="w-full">View Details</Button>
                  </Link>
                  <button
                    className="bg-black text-white py-3 px-6 flex items-center justify-center"
                    onClick={(e) => handleAddToCart(zoomView, e)}
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
      <Footer />
    </section>
  )
}

function ProductCard({
  product,
  onZoomView,
  onAddToCart,
}: {
  product: Product
  onZoomView: () => void
  onAddToCart: (product: Product, e: React.MouseEvent) => void
}) {
  const [isHovered, setIsHovered] = useState(false)

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
          {product.isSale && (
            <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 z-10">SALE</div>
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
                  >
                    <ShoppingBag size={16} className="mr-2" />
                    ADD TO CART
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
          {product.salePrice ? (
            <>
              <span className="font-bold text-red-500 mr-2">{formatCurrency(product.salePrice)}</span>
              <span className="text-gray-500 line-through text-sm">{formatCurrency(product.price)}</span>
            </>
          ) : (
            <span className="font-bold">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
