"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, RefreshCw, X } from "lucide-react"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, total } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const handleUpdateCart = () => {
    // In a real app, you might validate quantities or apply coupons here
    alert("Cart updated!")
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-[#f8f7f3] pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title and Breadcrumb */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
            <div className="text-sm text-gray-500">
              <Link href="/" className="hover:text-black">
                Home
              </Link>{" "}
              &gt;{" "}
              <Link href="/shop" className="hover:text-black">
                Shop
              </Link>{" "}
              &gt; Shopping Cart
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/shop" className="inline-block bg-black text-white px-8 py-3 uppercase font-medium text-sm">
                CONTINUE SHOPPING
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-sm shadow-sm overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium">
                    <div className="col-span-6">PRODUCT</div>
                    <div className="col-span-2 text-center">QUANTITY</div>
                    <div className="col-span-3 text-right">TOTAL</div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Cart Items */}
                  {items.map((item) => (
                    <div key={item._id} className="grid grid-cols-12 gap-4 p-4 border-b items-center">
                      <div className="col-span-6 flex items-center">
                        <div className="w-20 h-20 bg-gray-100 mr-4 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-gray-600">{formatCurrency(item.salePrice || item.price)}</p>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center">
                          <button
                            className="p-1"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            className="p-1"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="col-span-3 text-right font-medium">
                        {formatCurrency((item.salePrice || item.price) * item.quantity)}
                      </div>
                      <div className="col-span-1 text-right">
                        <button
                          className="p-1 text-gray-500 hover:text-black"
                          onClick={() => removeItem(item._id)}
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-between mt-6">
                  <Link
                    href="/shop"
                    className="border border-black px-6 py-3 uppercase text-sm font-medium hover:bg-black hover:text-white transition-colors"
                  >
                    CONTINUE SHOPPING
                  </Link>
                  <Button
                    className="bg-black text-white px-6 py-3 uppercase text-sm font-medium flex items-center"
                    onClick={handleUpdateCart}
                  >
                    <RefreshCw size={16} className="mr-2" />
                    UPDATE CART
                  </Button>
                </div>
              </div>

              {/* Cart Total */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-sm shadow-sm p-6">
                  {/* Discount Code */}
                  <div className="mb-8">
                    <h3 className="font-bold uppercase text-sm mb-4">DISCOUNT CODES</h3>
                    <div className="flex">
                      <Input
                        type="text"
                        placeholder="Coupon code"
                        className="flex-1 border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button className="bg-black text-white px-4 py-2 uppercase text-sm font-medium">APPLY</Button>
                    </div>
                  </div>

                  {/* Cart Total */}
                  <div>
                    <h3 className="font-bold uppercase text-sm mb-4">CART TOTAL</h3>
                    <div className="border-b pb-4 mb-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span className="font-medium text-red-500">{formatCurrency(subtotal)}</span>
                      </div>
                    </div>
                    <div className="flex justify-between mb-6">
                      <span className="font-medium">Total</span>
                      <span className="font-medium text-red-500">{formatCurrency(total)}</span>
                    </div>
                    <Link
                      href="/checkout"
                      className="block bg-black text-white text-center px-6 py-3 uppercase text-sm font-medium"
                    >
                      PROCEED TO CHECKOUT
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
