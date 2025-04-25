"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import CollectionSection from "@/components/collection-section"
import ProductCatalog from "@/components/product-catalog"
import DealsSection from "@/components/deals-section"
import InstagramSection from "@/components/instagram-section"
import NewsSection from "@/components/news-section"
import Footer from "@/components/footer"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import { useRouter } from "next/navigation"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const slides = [
    {
      label: "SUMMER COLLECTION",
      title: "Fall - Winter Collections " + `${new Date().getFullYear()}`,
      description:
        "A specialist label creating luxury essentials. Ethically crafted with an unwavering commitment to exceptional quality.",
      image: "/assets/hooke-men-hoodie-banner-winter-mobile.jpg",
    },
    {
      label: "NEW ARRIVALS",
      title: "Spring Essentials "+ `${new Date().getFullYear()}`,
      description: "Discover our latest collection of premium menswear designed for the modern gentleman.",
      image: "/assets/slide1.jpg?height=600&width=600",
    },
    {
      label: "LIMITED EDITION",
      title: "Exclusive Designer Collaborations",
      description: "Unique pieces created in partnership with renowned designers. Available for a limited time only.",
      image: "/assets/slide2.jpg?height=600&width=600",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-[#f8f7f3]">
      <TopBar />
      <Header />
      <div className="relative overflow-hidden" ref={sliderRef}>
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full">
              <HeroSection slide={slide} />
            </div>
          ))}
        </div>

        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-700 hover:text-black z-10"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ArrowLeft size={24} />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-700 hover:text-black z-10"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ArrowRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-black" : "bg-gray-400"}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
      <CollectionSection />
      <DealsSection />
      <ProductCatalog />
      <InstagramSection />
      <NewsSection />
      <Footer />
    </main>
  )
}

interface Slide {
  label: string
  title: string
  description: string
  image: string
}

function HeroSection({ slide }: { slide: Slide }) {
  const router = useRouter()
  return (
    <section className="container mx-auto px-4 py-12 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <span className="text-red-500 uppercase tracking-wider text-sm font-medium">{slide.label}</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {slide.title.split(" ").slice(0, 2).join(" ")}
            <br />
            {slide.title.split(" ").slice(2).join(" ")}
          </h1>
          <p className="text-gray-700 max-w-md">{slide.description}</p>
          <button onClick={()=> router.push('/shop')} className="bg-black text-white px-8 py-3 uppercase font-medium flex items-center group">
            SHOP NOW
            <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="flex space-x-4 pt-8">
            <Link href="#" aria-label="Facebook">
              <Facebook size={18} className="text-gray-700 hover:text-black" />
            </Link>
            <Link href="#" aria-label="Twitter">
              <Twitter size={18} className="text-gray-700 hover:text-black" />
            </Link>
            <Link href="#" aria-label="Pinterest">
              <Linkedin size={18} className="text-gray-700 hover:text-black" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram size={18} className="text-gray-700 hover:text-black" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[#f8e1dc] rounded-full transform -translate-x-8"></div>
          <Image
            src={slide.image || "/placeholder.svg"}
            alt="Fashion model"
            width={600}
            height={600}
            className="relative z-10"
            priority
          />
        </motion.div>
      </div>
    </section>
  )
}
