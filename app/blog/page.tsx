"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Star, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"

type BlogPost = {
  id: number
  title: string
  slug: string
  image: string
  date: string
  rating: number
  excerpt: string
}

export default function BlogPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const featuredPosts = [
    {
      id: 1,
      title: "Fashion Trends for Summer 2023",
      image: "/assets/summer_shoes_-_loafers_1024x1024.webp?height=600&width=1200",
      excerpt: "Discover the hottest fashion trends that will dominate this summer season.",
    },
    {
      id: 2,
      title: "Essential Men's Accessories for Every Occasion",
      image: "/assets/blog-banner2.webp?height=600&width=1200",
      excerpt: "From casual outings to formal events, these accessories will elevate your style.",
    },
    {
      id: 3,
      title: "How to Build a Sustainable Wardrobe",
      image: "/assets/blog-banner1.jpg?height=600&width=1200",
      excerpt: "Learn how to make environmentally conscious choices while staying fashionable.",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredPosts.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredPosts.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "What Curling Irons Are The Best Ones",
      slug: "what-curling-irons-are-the-best-ones",
      image: "https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Short%20Sleeve%20Shirt/thumbnail.png?height=300&width=300",
      date: "16 February 2020",
      rating: 5,
      excerpt: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      title: "Eternity Bands Do Last Forever",
      slug: "eternity-bands-do-last-forever",
      image: "https://cdn.dummyjson.com/products/images/mens-shirts/Men%20Check%20Shirt/thumbnail.png?height=300&width=300",
      date: "21 February 2020",
      rating: 4.5,
      excerpt: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    },
    {
      id: 3,
      title: "The Health Benefits Of Sunglasses",
      slug: "the-health-benefits-of-sunglasses",
      image: "https://cdn.dummyjson.com/products/images/sunglasses/Green%20and%20Black%20Glasses/thumbnail.png?height=300&width=300",
      date: "28 February 2020",
      rating: 5,
      excerpt: "Amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 4,
      title: "Aiming For Higher Tie Maintenance",
      slug: "aiming-for-higher-tie-maintenance",
      image: "https://cdn.dummyjson.com/products/images/furniture/Bedside%20Table%20African%20Cherry/thumbnail.png?height=300&width=300",
      date: "03 March 2020",
      rating: 4,
      excerpt: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 5,
      title: "Wedding Rings A Gift For A Lifetime",
      slug: "wedding-rings-a-gift-for-a-lifetime",
      image: "https://cdn.dummyjson.com/products/images/furniture/Wooden%20Bathroom%20Sink%20With%20Mirror/thumbnail.png?height=300&width=300",
      date: "12 March 2020",
      rating: 4.5,
      excerpt: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    },
    {
      id: 6,
      title: "The Different Methods Of Hair Removal",
      slug: "the-different-methods-of-hair-removal",
      image: "https://cdn.dummyjson.com/products/images/smartphones/iPhone%20X/thumbnail.png?height=300&width=300",
      date: "18 March 2020",
      rating: 4,
      excerpt: "Amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 7,
      title: "How Earrings A Style From History",
      slug: "how-earrings-a-style-from-history",
      image: "https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/thumbnail.png?height=300&width=300",
      date: "24 March 2020",
      rating: 5,
      excerpt: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 8,
      title: "Lasik Eye Surgery Are You Ready",
      slug: "lasik-eye-surgery-are-you-ready",
      image: "https://cdn.dummyjson.com/products/images/sunglasses/Party%20Glasses/thumbnail.png?height=300&width=300",
      date: "30 March 2020",
      rating: 4.5,
      excerpt: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    },
    {
      id: 9,
      title: "Lasik Eye Surgery Are You Ready",
      slug: "lasik-eye-surgery-are-you-ready-2",
      image: "https://cdn.dummyjson.com/products/images/sunglasses/Sunglasses/thumbnail.png?height=300&width=300",
      date: "06 April 2020",
      rating: 4,
      excerpt: "Amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ]

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-[#f8f7f3] pb-16">
        {/* Banner Slider */}
        <div className="relative overflow-hidden" ref={sliderRef}>
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredPosts.map((post, index) => (
              <div key={post.id} className="min-w-full relative">
                <div className="relative h-[400px] md:h-[500px]">
                  <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white max-w-3xl px-4">
                      <h2 className="text-3xl md:text-5xl font-bold mb-4">{post.title}</h2>
                      <p className="text-lg md:text-xl mb-6">{post.excerpt}</p>
                      <Link
                        href={`/blog/${post.id}`}
                        className="inline-block bg-white text-black px-8 py-3 uppercase font-medium text-sm hover:bg-gray-100 transition-colors"
                      >
                        READ MORE
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ArrowLeft size={24} />
          </button>

          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ArrowRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {featuredPosts.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white bg-opacity-50"}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-center mb-12">Our Blog</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <motion.article
                key={post.id}
                className="bg-white shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={300}
                      height={300}
                      className="w-full h-auto aspect-square object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 bg-white px-3 py-1 flex items-center text-xs">
                      <Calendar size={12} className="mr-1" />
                      {post.date}
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <h2 className="text-lg font-bold mb-2 hover:text-red-500 transition-colors">{post.title}</h2>
                  </Link>
                  <div className="flex mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={
                          i < Math.floor(post.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < post.rating
                              ? "fill-yellow-400 text-yellow-400 fill-[50%]"
                              : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
