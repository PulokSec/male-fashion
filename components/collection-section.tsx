"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function CollectionSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="order-2 lg:order-1">
            <motion.div
              className="bg-gray-100 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://cdn.dummyjson.com/products/images/mens-shirts/Man%20Plaid%20Shirt/thumbnail.png?height=500&width=500"
                alt="Man wearing a black jacket with white hoodie"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4">Clothing Collections {new Date().getFullYear()}</h2>
              <Link
                href="/shop?category=mens-shirts&maxPrice=1000&sort=createdAt"
                className="inline-block uppercase text-sm font-medium border-b border-black pb-1 hover:pb-2 transition-all duration-300 flex items-center"
              >
                SHOP NOW
                <ArrowRight size={14} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-3xl font-bold mb-4">Accessories</h2>
              <Link
                href="/shop?category=mens-watches&maxPrice=1000&sort=createdAt"
                className="inline-block uppercase text-sm font-medium border-b border-black pb-1 hover:pb-2 transition-all duration-300 flex items-center"
              >
                SHOP NOW
                <ArrowRight size={14} className="ml-2" />
              </Link>
            </motion.div>
          </div>
          <div>
            <motion.div
              className="bg-gray-100 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Cellini%20Moonphase/thumbnail.png?height=500&width=500"
                alt="Round sunglasses with gold frame"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="order-2 lg:order-1">
            <motion.div
              className="bg-gray-100 rounded-lg overflow-hidden"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src="https://cdn.dummyjson.com/products/images/mens-shoes/Nike%20Air%20Jordan%201%20Red%20And%20Black/thumbnail.png?height=500&width=500"
                alt="Navy and brown casual sneakers"
                width={500}
                height={500}
                className="w-full h-auto object-cover"
              />
            </motion.div>
          </div>
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-4">Shoes Spring {new Date().getFullYear()}</h2>
              <Link
                href="/shop?category=mens-shoes&maxPrice=1000&sort=createdAt"
                className="inline-block uppercase text-sm font-medium border-b border-black pb-1 hover:pb-2 transition-all duration-300 flex items-center"
              >
                SHOP NOW
                <ArrowRight size={14} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
