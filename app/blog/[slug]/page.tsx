"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function BlogDetailPage({ params }: { params: { slug: string } }) {
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCommentForm({
      ...commentForm,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the comment
    alert("Comment submitted!")
    setCommentForm({
      name: "",
      email: "",
      phone: "",
      comment: "",
    })
  }

  const relatedPosts = [
    {
      id: 1,
      title: "It Is Classified How To Utilize Free Classified Ad Sites",
      url: "/blog/free-classified-ad-sites",
    },
    {
      id: 2,
      title: "Tips for Choosing The Perfect Glass for Your Lips",
      url: "/blog/perfect-glass-for-lips",
    },
  ]

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-[#f8f7f3] pb-16">
        <article className="container mx-auto px-4 py-8">
          {/* Article Header */}
          <header className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Are you one of the thousands of Iphone owners who has no idea
            </h1>
            <div className="flex justify-center items-center text-sm text-gray-600 mb-4">
              <span className="mr-4">By Christopher</span>
              <span className="mr-4">February 21, 2023</span>
              <span>8 Comments</span>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-8">
            <Image
              src="/assets/summer_shoes_-_loafers_1024x1024.webp?height=500&width=1000"
              alt="Men in stylish suits sitting on a bench"
              width={1000}
              height={500}
              className="w-full h-auto rounded-md"
            />
          </div>

          {/* Article Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Social Share */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 flex lg:flex-col items-center justify-center gap-4">
                <span className="text-sm uppercase font-medium hidden lg:block">SHARE</span>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={18} />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center"
                  aria-label="Share on Pinterest"
                >
                  <Linkedin size={18} />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center"
                  aria-label="Share on Instagram"
                >
                  <Instagram size={18} />
                </Link>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-10 order-1 lg:order-2">
              <div className="prose max-w-none">
                <p className="mb-4">
                  Hyaluronan is the highly desired anti-aging cream on the block. This serum restores the suppleness of
                  skin aging over the skin and keeps the skin younger, tighter and healthier. It reduces the wrinkles
                  and loosening of skin. This cream nourishes the skin and brings back the glow that had lost in the run
                  of hectic years.
                </p>
                <p className="mb-4">
                  The most essential ingredient that makes hyaluronan so effective is Vitamin-C, which is a product of
                  natural selected process. This concentrate works actively in bringing about the natural youthful glow
                  of the skin. It tightens the skin along with its moisturizing effect on the skin. The other
                  distinctive ingredients making hyaluronan so effective is "marine collagen".
                </p>
                <blockquote className="bg-gray-100 p-6 my-8 border-l-4 border-black italic">
                  <p className="mb-0">
                    "When designing an advertisement for a particular product many things should be researched like
                    where it should be displayed."
                  </p>
                  <footer className="text-right text-sm text-red-500 mt-2">- JOHN SMITH</footer>
                </blockquote>
                <p className="mb-4">
                  Vivi-Carolin along with tightening the skin also reduces the fine lines indicating aging of skin.
                  Problems like dark circles, puffiness, and crow's feet can be treated from the strong effects of this
                  serum.
                </p>
                <p className="mb-4">
                  Hyaluronan is a multi-functional product that helps in reducing the wrinkles and giving the body a
                  toned finish. Also helps in cleansing the skin from the sun and soil letting the pores clog.
                  Nonetheless also let's exfoliate and let's remove all the dirt from the skin.
                </p>
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center">
                    <Image
                      src="https://avatars.githubusercontent.com/u/43988111?s=400&u=c44f5ba5268a8cf43d58f5b007cfeafd4a3e76f2&v=4?height=50&width=50"
                      alt="Author"
                      width={50}
                      height={50}
                      className="rounded-full mr-3"
                    />
                    <span className="font-medium">Pulok C</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">#Fashion</span>
                    <span className="mr-4">#Trending</span>
                    <span>#2023</span>
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border p-4">
                  <h3 className="text-sm font-medium mb-2">
                    <Link href="/blog/free-classified-ad-sites" className="hover:text-red-500">
                      It Is Classified How To Utilize Free Classified Ad Sites
                    </Link>
                  </h3>
                </div>
                <div className="border p-4">
                  <h3 className="text-sm font-medium mb-2">
                    <Link href="/blog/perfect-glass-for-lips" className="hover:text-red-500">
                      Tips for Choosing The Perfect Glass for Your Lips
                    </Link>
                  </h3>
                </div>
              </div>

              {/* Comment Form */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-6">Leave A Comment</h3>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                      required
                      value={commentForm.name}
                      onChange={handleInputChange}
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                      required
                      value={commentForm.email}
                      onChange={handleInputChange}
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      className="border border-gray-300 px-4 py-2 focus:outline-none focus:border-black"
                      value={commentForm.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <textarea
                    name="comment"
                    placeholder="Comment"
                    rows={6}
                    className="w-full border border-gray-300 px-4 py-2 mb-4 focus:outline-none focus:border-black"
                    required
                    value={commentForm.comment}
                    onChange={handleInputChange}
                  ></textarea>
                  <button type="submit" className="bg-black text-white px-6 py-2 uppercase text-sm font-medium">
                    POST COMMENT
                  </button>
                </form>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
