"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

type Deal = {
  _id: string
  title: string
  price: number
  discountPercentage: number
  thumbnail: string
  images: string[]
  startDate: string
  endDate: string
  category: string
  stock: number
  featured: boolean
  productId: string
  status: "active" | "scheduled" | "expired"
}

type Category = {
  _id: string
  name: string
  count: number
}

export default function DealsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Fetch categories and deals
  useEffect(() => {
    const fetchCategoriesAndDeals = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch categories
        const categoryResponse = await fetch("/api/categories/stats")
        if (!categoryResponse.ok) {
          throw new Error("Failed to fetch categories")
        }
        const categoryData = await categoryResponse.json()

        // Format categories for display
        const formattedCategories = categoryData.categories.map((cat: any) => ({
          _id: cat._id,
          name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1), // Capitalize first letter
          count: cat.count,
        }))

        setCategories(formattedCategories)

        // Set initial active category
        if (formattedCategories.length > 0 && !activeCategory) {
          setActiveCategory(formattedCategories[0]._id)
        }

        // Fetch deals
        const dealsResponse = await fetch("/api/deals?active=true")
        if (!dealsResponse.ok) {
          throw new Error("Failed to fetch deals")
        }
        const dealsData = await dealsResponse.json()

        // Calculate deal status and sort by featured first, then by end date
        const processedDeals = dealsData
          .map((deal: any) => {
            const now = new Date()
            const startDate = new Date(deal.startDate)
            const endDate = new Date(deal.endDate)

            let status: "active" | "scheduled" | "expired" = "expired"

            if (now < startDate) {
              status = "scheduled"
            } else if (now >= startDate && now <= endDate) {
              status = "active"
            }

            return {
              ...deal,
              status,
            }
          })
          .filter((deal: Deal) => deal.status === "active") // Only show active deals
          .sort((a: Deal, b: Deal) => {
            // Featured deals first
            if (a.featured && !b.featured) return -1
            if (!a.featured && b.featured) return 1

            // Then sort by end date (soonest ending first)
            return new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          })

        // Get unique category IDs from active deals
  const activeCategoryIds = new Set(processedDeals.map((deal: Deal) => deal.category));

  // Filter categories to only those with active deals
  const activeCategories = formattedCategories.filter((cat: Category) =>
    activeCategoryIds.has(cat._id)
  );

  setCategories(activeCategories); // Update categories state

  // Set initial active category (only if categories exist)
  if (activeCategories.length > 0 && !activeCategory) {
    setActiveCategory(activeCategories[0]._id);
  }

  setDeals(processedDeals);

        // Set initial active deal (prioritize featured deals)
        if (processedDeals.length > 0) {
          const featuredDeals = processedDeals.filter((deal: Deal) => deal.featured)
          setActiveDeal(featuredDeals.length > 0 ? featuredDeals[0] : processedDeals[0])
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load deals. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategoriesAndDeals()
  }, [])

  // Update active deal when category changes
  useEffect(() => {
    if (activeCategory && deals.length > 0) {
      // First try to find featured deals in the selected category
      const featuredDealsInCategory = deals.filter((deal) => deal.category === activeCategory && deal.featured)

      // If no featured deals, look for any deals in the category
      const dealsInCategory = deals.filter((deal) => deal.category === activeCategory)

      if (featuredDealsInCategory.length > 0) {
        setActiveDeal(featuredDealsInCategory[0])
      } else if (dealsInCategory.length > 0) {
        setActiveDeal(dealsInCategory[0])
      } else {
        // If no deals in selected category, use the first featured deal or just the first deal
        const featuredDeals = deals.filter((deal) => deal.featured)
        setActiveDeal(featuredDeals.length > 0 ? featuredDeals[0] : deals[0])
      }
    }
  }, [activeCategory, deals])

  // Countdown timer
  useEffect(() => {
    if (!activeDeal) return

    const calculateTimeLeft = () => {
      const difference = new Date(activeDeal.endDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        // Deal has expired
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [activeDeal])

  const formatTime = (time: number) => {
    return time < 10 ? `0${time}` : time
  }

  const calculateSalePrice = (price: number, discountPercentage: number) => {
    return price - (price * discountPercentage) / 100
  }
  console.log(activeDeal);
  if (loading) {
    return (
      <section className="py-16 bg-[#f8f7f3]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
            {/* Left side - Category skeleton */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <div className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-8 w-48" />
                ))}
              </div>
            </div>

            {/* Middle - Product image skeleton */}
            <div className="lg:col-span-4 flex items-center justify-center">
              <Skeleton className="w-full h-[400px]" />
            </div>

            {/* Right side - Deal info skeleton */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="space-y-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-64" />
                <div className="flex space-x-4 md:space-x-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-16 w-16" />
                  ))}
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !activeDeal) {
    return (
      <section className="py-16 bg-[#f8f7f3]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Deal of the Week</h2>
          <p className="text-gray-500 mb-6">{error || "No active deals available at the moment."}</p>
          <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 uppercase font-medium text-sm">
            SHOP NOW
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-[#f8f7f3]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Left side - Category slider */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <div className="lg:space-y-8 space-y-3 flex flex-col items-center">
              {categories.map((category) => (
                <motion.button
                  key={category._id}
                  className={`text-xl md:text-2xl font-medium text-left transition-colors duration-300 ${
                    activeCategory === category._id ? "text-black" : "text-gray-400"
                  }`}
                  onClick={() => setActiveCategory(category._id)}
                  whileHover={{ x: 10 }}
                  animate={{ x: activeCategory === category._id ? 10 : 0 }}
                >
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Middle - Product image */}
          <div className="lg:col-span-4 flex items-center justify-center relative w-full px-5">
            <div className="relative">
              <Image
                src={activeDeal.thumbnail || activeDeal.images?.[0] || "/placeholder.svg"}
                alt={activeDeal.title}
                width={400}
                height={400}
                className="object-contain"
              />
              <div className="absolute -top-4 -right-4 bg-black text-white rounded-full w-20 h-20 flex flex-col items-center justify-center text-center text-xs">
                <span>Save</span>
                <span className="font-bold text-sm">{activeDeal.discountPercentage.toFixed(0)}%</span>
              </div>
              {activeDeal.featured && (
                <Badge className="absolute top-4 left-4 bg-amber-500 hover:bg-amber-600">Featured</Badge>
              )}
            </div>
          </div>

          {/* Right side - Deal info and countdown */}
          <div className="lg:col-span-5 flex flex-col justify-center w-full px-5">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="uppercase text-red-500 tracking-wider text-sm font-medium">DEAL OF THE WEEK</div>
                {activeDeal.featured && (
                  <Badge variant="outline" className="border-amber-500 text-amber-500">
                    Featured
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl md:text-3xl font-bold">{activeDeal.title}</h2>

              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold text-red-500">
                  {formatCurrency(calculateSalePrice(activeDeal.price, activeDeal.discountPercentage))}
                </span>
                <span className="text-gray-500 line-through">{formatCurrency(activeDeal.price)}</span>
                <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded text-sm">
                  {activeDeal.discountPercentage.toFixed(0)}% OFF
                </span>
              </div>

              <div className="text-sm">
                <span className={activeDeal.stock > 0 ? "text-green-600" : "text-red-600"}>
                  {activeDeal.stock > 0 ? `In Stock (${activeDeal.stock})` : "Out of Stock"}
                </span>
              </div>

              <div className="flex space-x-4 md:space-x-6">
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold">{formatTime(timeLeft.days)}</div>
                  <div className="text-xs text-gray-500 mt-1">Days</div>
                </div>
                <div className="text-2xl md:text-4xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold">{formatTime(timeLeft.hours)}</div>
                  <div className="text-xs text-gray-500 mt-1">Hours</div>
                </div>
                <div className="text-2xl md:text-4xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold">{formatTime(timeLeft.minutes)}</div>
                  <div className="text-xs text-gray-500 mt-1">Minutes</div>
                </div>
                <div className="text-2xl md:text-4xl font-bold">:</div>
                <div className="text-center">
                  <div className="text-2xl md:text-4xl font-bold">{formatTime(timeLeft.seconds)}</div>
                  <div className="text-xs text-gray-500 mt-1">Seconds</div>
                </div>
              </div>

              <Link
                href={`/shop/product/${activeDeal.productId}`}
                className="inline-block bg-black text-white px-8 py-3 uppercase font-medium text-sm"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
