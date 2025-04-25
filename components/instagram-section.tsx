"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { InstagramIcon } from "lucide-react"

export default function InstagramSection() {
  const instagramPosts = [
    {
      id: 1,
      image: "https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Cellini%20Moonphase/thumbnail.png?height=300&width=300",
      alt: "Fashion accessories on a table",
    },
    {
      id: 2,
      image: "https://cdn.dummyjson.com/products/images/mens-shoes/Sports%20Sneakers%20Off%20White%20&%20Red/thumbnail.png?height=300&width=300",
      alt: "Folded clothes and shoes",
    },
    {
      id: 3,
      image: "https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Short%20Sleeve%20Shirt/thumbnail.png?height=300&width=300",
      alt: "Hawaii Shirts and Beachwear",
    },
    {
      id: 4,
      image: "https://cdn.dummyjson.com/products/images/sunglasses/Sunglasses/thumbnail.png?height=300&width=300",
      alt: "Sunglasses and accessories",
    },
    {
      id: 5,
      image: "https://cdn.dummyjson.com/products/images/mens-shirts/Gigabyte%20Aorus%20Men%20Tshirt/thumbnail.png?height=300&width=300",
      alt: "Gaming jersey and accessories",
    },
    {
      id: 6,
      image: "https://cdn.dummyjson.com/products/images/furniture/Knoll%20Saarinen%20Executive%20Conference%20Chair/thumbnail.png?height=300&width=300",
      alt: "Furniture and decor",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {instagramPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="relative group overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.alt}
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover aspect-square"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <InstagramIcon className="text-white w-8 h-8" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 lg:pl-12">
            <h2 className="text-3xl font-bold mb-4">Instagram</h2>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
            <Link href="https://instagram.com" className="text-red-500 text-2xl font-medium hover:underline">
              #Male_Fashion
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
