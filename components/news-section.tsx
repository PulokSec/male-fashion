"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { motion } from "framer-motion"

type NewsArticle = {
  id: number
  title: string
  image: string
  date: string
  excerpt: string
}

export default function NewsSection() {
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "What Curling Irons Are The Best Ones",
      image: "https://cdn.dummyjson.com/products/images/mens-shirts/Men%20Check%20Shirt/thumbnail.png?height=300&width=400",
      date: "16 February 2020",
      excerpt: "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      title: "Eternity Bands Do Last Forever",
      image: "https://cdn.dummyjson.com/products/images/mens-shirts/Gigabyte%20Aorus%20Men%20Tshirt/thumbnail.png?height=300&width=400",
      date: "21 February 2020",
      excerpt: "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.",
    },
    {
      id: 3,
      title: "The Health Benefits Of Sunglasses",
      image: "https://cdn.dummyjson.com/products/images/sunglasses/Black%20Sun%20Glasses/thumbnail.png?height=300&width=400",
      date: "28 February 2020",
      excerpt: "Amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <span className="text-red-500 uppercase tracking-wider text-sm font-medium">LATEST NEWS</span>
        </div>
        <h2 className="text-3xl font-bold text-center mb-12">Fashion New Trends</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsArticles.map((article) => (
            <motion.div
              key={article.id}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative overflow-hidden mb-4">
                <Image
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-4 bg-white px-4 py-2 flex items-center text-sm">
                  <Calendar size={14} className="mr-2" />
                  {article.date}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{article.title}</h3>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>
              <Link
                href={`/blog/${article.id}`}
                className="uppercase text-sm font-medium border-b border-black pb-1 hover:pb-2 transition-all duration-300"
              >
                READ MORE
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block bg-black text-white px-8 py-3 uppercase font-medium text-sm hover:bg-gray-800 transition-colors"
          >
            MORE NEWS
          </Link>
        </div>
      </div>
    </section>
  )
}
