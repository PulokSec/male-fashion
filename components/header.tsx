"use client"

import type React from "react"
import { Contact, Home as HomeIcon, Phone, ShoppingBasketIcon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ShoppingBag, Heart, Search, ChevronDown, X, User, Menu } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { items, itemCount, subtotal, removeItem } = useCart()
  const { user } = useAuth()

  // Close cart dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (cartOpen && !target.closest(".cart-dropdown") && !target.closest(".cart-button")) {
        setCartOpen(false)
      }

      if (showSearchResults && searchRef.current && !searchRef.current.contains(target)) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [cartOpen, showSearchResults])

  // Handle search input
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.length >= 2) {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data.products)
          setShowSearchResults(true)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    } else {
      setShowSearchResults(false)
    }
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchResults(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const menuItems = {
    Shop: [
      { name: "Men's Clothing", href: "/shop?category=clothing" },
      { name: "Accessories", href: "/shop?category=accessories" },
      { name: "Shoes", href: "/shop?category=shoes" },
      { name: "New Arrivals", href: "/shop?isNew=true" },
      { name: "Sale", href: "/shop?isSale=true" },
    ],
    Pages: [
      { name: "About Us", href: "/about" },
      { name: "Shop Details", href: "/shop-details" },
      { name: "Shopping Cart", href: "/cart" },
      { name: "Checkout", href: "/checkout" },
      { name: "FAQs", href: "/faqs" },
    ],
    Blog: [
      { name: "Fashion News", href: "/blog/fashion-news" },
      { name: "Style Guides", href: "/blog/style-guides" },
      { name: "Trends", href: "/blog/trends" },
    ],
  }

  return (
    <header className="container mx-auto px-4 py-6 flex items-center justify-between relative z-20">
      <div className="flex items-center">
        <button className="mr-4 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          <Menu size={24} />
        </button>

        <Link href="/" className="text-2xl font-bold">
          Male fashion<span className="text-red-500">.</span>
        </Link>
      </div>
      {/* Mobile Bottom Navigation */}
<div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-200 shadow md:hidden">
  <div className="flex justify-around items-center h-14">
    <Link href="/" className="flex flex-col items-center justify-center text-gray-600 hover:text-black">
      <HomeIcon size={20} />
      <span className="text-xs">Home</span>
    </Link>
    <Link href="/shop" className="flex flex-col items-center justify-center text-gray-600 hover:text-black">
      <ShoppingBasketIcon size={20} />
      <span className="text-xs">Shop</span>
    </Link>
    <Link href="/contact-us" className="flex flex-col items-center justify-center text-gray-600 hover:text-black">
      <Phone size={20} />
      <span className="text-xs">Contact</span>
    </Link>
    {
      !user ? (
        <Link href="/signin" className="flex flex-col items-center justify-center text-gray-600 hover:text-black">
          <User size={20} />
          <span className="text-xs">Sign In</span>
        </Link>
      ) : (<Link
      href={user?.isAdmin ? "/admin/dashboard" : "/profile"}
      className="p-1 flex items-center"
      title={user?.isAdmin ? "Admin Dashboard" : "Profile"}
    >
      {user?.isAdmin ? (
        <div className="flex flex-col items-center">
          <User size={20} className="text-red-500" />
          <span className="text-xs font-medium inline">Admin</span>
        </div>
      ) : (
        <div className="flex items-center">
        <User size={20} />
        <span className="text-xs">Profile</span>
      </div>
      )}
    </Link>)
    }
  </div>
</div>


      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-white z-50 md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" className="text-2xl font-bold" onClick={() => setMobileMenuOpen(false)}>
                Male fashion<span className="text-red-500">.</span>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <form onSubmit={handleSearchSubmit} className="mb-6">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search products..."
                    className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    aria-label="Search"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>

              <nav className="space-y-6">
                <Link href="/" className="block text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>

                {Object.entries(menuItems).map(([category, items]) => (
                  <div key={category} className="space-y-2">
                    <div className="text-lg font-medium">{category}</div>
                    <div className="pl-4 space-y-2">
                      {items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block text-gray-600"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <Link href="/contact-us" className="block text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Contacts
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/"
          className="text-sm font-medium hover:border-b-2 hover:border-black pb-1"
          onMouseEnter={() => setActiveMenu(null)}
        >
          Home
        </Link>

        {Object.keys(menuItems).map((item) => (
          <div
            key={item}
            className="relative"
            onMouseEnter={() => setActiveMenu(item)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              href={`/${item.toLowerCase()}`}
              className={`text-sm font-medium hover:border-b-2 hover:border-black pb-1 flex items-center ${
                activeMenu === item ? "border-b-2 border-black" : ""
              }`}
            >
              {item}
              <ChevronDown size={14} className="ml-1" />
            </Link>

            {activeMenu === item && (
              <div className="absolute left-0 mt-2w-48 z-50">
              <div className="mt-2 w-48 bg-white shadow-md">
                {menuItems[item as keyof typeof menuItems].map((subItem) => (
                  <Link key={subItem.name} href={subItem.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
                    {subItem.name}
                  </Link>
                ))}
                </div>
              </div>
            )}
          </div>
        ))}

        <Link
          href="/contact-us"
          className="text-sm font-medium hover:border-b-2 hover:border-black pb-1"
          onMouseEnter={() => setActiveMenu(null)}
        >
          Contacts
        </Link>
      </nav>

      <div className="flex items-center space-x-4">
        <div className="relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="hidden md:block">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-40 lg:w-64 border-b border-gray-300 py-1 pr-8 focus:outline-none focus:border-black transition-all bg-transparent"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSearchResults(true)
                  }
                }}
              />
              <button type="submit" className="absolute right-0 top-1/2 transform -translate-y-1/2" aria-label="Search">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showSearchResults && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md overflow-hidden z-50"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-gray-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product._id}
                          href={`/shop/product/${product._id}`}
                          className="flex items-center p-3 hover:bg-gray-50 border-b border-gray-100"
                          onClick={() => setShowSearchResults(false)}
                        >
                          <div className="w-12 h-12 bg-gray-100 mr-3 flex-shrink-0">
                            <Image
                              src={product.thumbnail || product.images?.[0] || "/placeholder.svg"}
                              alt={product.title || product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{product.title || product.name}</h4>
                            <p className="text-sm text-gray-500">
                              {formatCurrency(
                                product.discountPercentage > 0
                                  ? product.price * (1 - product.discountPercentage / 100)
                                  : product.price,
                              )}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 border-t">
                      <button
                        className="w-full text-center text-sm text-gray-600 hover:text-black py-1"
                        onClick={() => {
                          setShowSearchResults(false)
                          router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
                        }}
                      >
                        View all results
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No products found</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {
          !user ? (
            <Link href="/signin" className="p-1" aria-label="Sign In">
              <User size={20} />
            </Link>
          ) : (
            <Link
          href={user?.isAdmin ? "/admin/dashboard" : "/profile"}
          className="p-1 items-center hidden md:flex"
          title={user?.isAdmin ? "Admin Dashboard" : "Profile"}
        >
          {user?.isAdmin ? (
            <div className="flex items-center">
              <User size={20} className="text-red-500" />
              <span className="ml-1 text-xs font-medium hidden md:inline">Admin</span>
            </div>
          ) : (
            <User size={20} />
          )}
        </Link>
          )
        }

        <button aria-label="Wishlist" className="p-1">
          <Heart size={20} />
        </button>

        <div className="relative">
          <button
            aria-label="Cart"
            className="flex items-center p-1 cart-button"
            onClick={() => setCartOpen(!cartOpen)}
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
            <span className="ml-1 text-sm hidden md:inline">{formatCurrency(subtotal)}</span>
          </button>

          <AnimatePresence>
            {cartOpen && (
              <motion.div
                className="absolute right-0 mt-2 w-80 bg-white shadow-lg z-50 cart-dropdown"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-4 max-h-96 overflow-auto">
                  <h3 className="font-medium mb-3">Shopping Cart</h3>

                  {items.length === 0 ? (
                    <p className="text-gray-500 text-sm">Your cart is empty</p>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item._id} className="flex items-center gap-3 pb-3 border-b">
                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium truncate">{item.name}</h4>
                              <div className="flex items-center text-sm">
                                <span>{item.quantity} × </span>
                                <span className="font-medium">{formatCurrency(item.salePrice || item.price)}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => removeItem(item._id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between font-medium mt-4 mb-4">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href="/cart"
                          className="flex-1 bg-gray-200 text-center py-2 text-sm font-medium"
                          onClick={() => setCartOpen(false)}
                        >
                          VIEW CART
                        </Link>
                        <Link
                          href="/checkout"
                          className="flex-1 bg-black text-white text-center py-2 text-sm font-medium"
                          onClick={() => setCartOpen(false)}
                        >
                          CHECKOUT
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
