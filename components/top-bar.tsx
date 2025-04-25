"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"

export default function TopBar() {
  const [currencyOpen, setCurrencyOpen] = useState(false)

  return (
    <div className="bg-black text-white py-2 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <p className="text-xs md:text-sm">Free shipping, 30-day return or refund guarantee.</p>
        <div className="flex items-center space-x-6">
          <Link href="/faqs" className="text-xs md:text-sm hover:underline">
            FAQS
          </Link>
          <div className="relative">
            <button className="text-xs md:text-sm flex items-center" onClick={() => setCurrencyOpen(!currencyOpen)}>
              USD <ChevronDown size={14} className="ml-1" />
            </button>
            {currencyOpen && (
              <div className="absolute right-0 mt-2 w-24 bg-white text-black shadow-md z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-gray-100 font-medium"
                  onClick={() => setCurrencyOpen(false)}
                >
                  USD
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-gray-100"
                  onClick={() => setCurrencyOpen(false)}
                >
                  EUR
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-xs md:text-sm hover:bg-gray-100"
                  onClick={() => setCurrencyOpen(false)}
                >
                  USD
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
