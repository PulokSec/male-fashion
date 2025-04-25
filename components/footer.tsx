import Image from "next/image"
import Link from "next/link"
import { Heart, Send } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-2xl font-bold inline-block mb-6">
              Male fashion<span className="text-red-500">.</span>
            </Link>
            <p className="text-gray-400 mb-8 max-w-xs">
              The customer is at the heart of our unique business model, which includes design.
            </p>
            <div className="flex space-x-2">
              <Image
                src="/assets/klarna.png?height=30&width=50"
                alt="Klarna"
                width={50}
                height={30}
                className="h-8 w-auto object-contain bg-white rounded-sm p-1"
              />
              <Image
                src="/assets/american-express.png?height=30&width=50"
                alt="American Express"
                width={50}
                height={30}
                className="h-8 w-auto object-contain bg-white rounded-sm p-1"
              />
              <Image
                src="/assets/paypal.png?height=30&width=50"
                alt="PayPal"
                width={50}
                height={30}
                className="h-8 w-auto object-contain bg-white rounded-sm p-1"
              />
              <Image
                src="/assets/mcard.png?height=30&width=50"
                alt="Mastercard"
                width={50}
                height={30}
                className="h-8 w-auto object-contain bg-white rounded-sm p-1"
              />
              <Image
                src="/assets/visa.png?height=30&width=50"
                alt="Visa"
                width={50}
                height={30}
                className="h-8 w-auto object-contain bg-white rounded-sm p-1"
              />
            </div>
          </div>

          {/* Shopping Links 1 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold uppercase mb-6">Shopping</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/shop/clothing" className="text-gray-400 hover:text-white transition-colors">
                  Clothing Store
                </Link>
              </li>
              <li>
                <Link href="/shop/shoes" className="text-gray-400 hover:text-white transition-colors">
                  Trending Shoes
                </Link>
              </li>
              <li>
                <Link href="/shop/accessories" className="text-gray-400 hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/shop/sale" className="text-gray-400 hover:text-white transition-colors">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                  Seller Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Shopping Links 2 */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold uppercase mb-6">Shopping</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/payment-methods" className="text-gray-400 hover:text-white transition-colors">
                  Payment Methods
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-gray-400 hover:text-white transition-colors">
                  Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Return & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold uppercase mb-6">Newsletter</h3>
            <p className="text-gray-400 mb-6">Be the first to know about new arrivals, look books, sales & promos!</p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-black border-b border-gray-600 py-2 pr-10 pl-0 text-white placeholder-gray-500 focus:outline-none focus:border-white"
              />
              <button className="absolute right-0 top-2">
                <Send size={20} className="text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            Copyright © {new Date().getFullYear()} All rights reserved | This template is made with{" "}
            <Heart size={14} className="inline-block fill-red-500 text-red-500" /> by{" "}
            <a href="https://pulokchowdhury.github.io" target="_blank" rel="noopener noreferrer" className="text-red-500">
              Pulok Chowdhury
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
