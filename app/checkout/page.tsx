"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/utils"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function CheckoutPage() {
  const { items, subtotal, total, clearCart } = useCart()
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null)

  useEffect(() => {
    // Create a payment intent when the page loads
    if (items.length > 0) {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item._id,
            quantity: item.quantity,
            price: item.salePrice || item.price,
          })),
          amount: total,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret)
          setPaymentIntent(data.id)
        })
        .catch((error) => {
          console.error("Error creating payment intent:", error)
        })
    }
  }, [items, total])

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return (
      <>
        <TopBar />
        <Header />
        <main className="bg-[#f8f7f3] pb-16">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
            <p className="mb-8">You need to add items to your cart before checking out.</p>
            <Link href="/shop">
              <Button className="bg-black text-white">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-[#f8f7f3] pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Page Title and Breadcrumb */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Check Out</h1>
            <div className="text-sm text-gray-500">
              <Link href="/" className="hover:text-black">
                Home
              </Link>{" "}
              &gt;{" "}
              <Link href="/shop" className="hover:text-black">
                Shop
              </Link>{" "}
              &gt; Check Out
            </div>
          </div>

          {/* Coupon Alert */}
          <div className="bg-green-50 border border-green-200 p-4 mb-8 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-sm">
              Have a coupon? <button className="text-blue-600 hover:underline">Click here to enter your code.</button>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              {clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm paymentIntentId={paymentIntent} />
                </Elements>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                  <span className="ml-2">Preparing checkout...</span>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-sm shadow-sm p-6">
                <h2 className="text-lg font-bold mb-6">YOUR ORDER</h2>

                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between mb-2 font-medium">
                    <span>Product</span>
                    <span>Total</span>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4 space-y-2">
                  {items.map((item) => (
                    <div key={item._id} className="flex justify-between">
                      <span className="text-gray-600">
                        {item.name} × {item.quantity}
                      </span>
                      <span>{formatCurrency((item.salePrice || item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Subtotal</span>
                    <span className="text-red-500">{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Total</span>
                    <span className="text-red-500 font-bold">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function CheckoutForm({ paymentIntentId }: { paymentIntentId: string | null }) {
  const router = useRouter()
  const stripe = useStripe()
  const elements = useElements()
  const { clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    createAccount: false,
    password: "",
    orderNotes: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }

    setIsLoading(true)
    setMessage(null)

    // Save billing details to your backend
    try {
      const billingResponse = await fetch("/api/save-billing-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          billingDetails: formData,
        }),
      })

      if (!billingResponse.ok) {
        throw new Error("Failed to save billing details")
      }
    } catch (error) {
      console.error("Error saving billing details:", error)
      setMessage("An error occurred while processing your order. Please try again.")
      setIsLoading(false)
      return
    }

    // Confirm the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
      redirect: "if_required",
    })

    if (error) {
      // Show error message
      setMessage(error.message || "An error occurred while processing your payment.")
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      // Payment succeeded
      setMessage("Payment successful! Redirecting to confirmation page...")
      clearCart()

      // Redirect to success page
      setTimeout(() => {
        router.push("/checkout/success")
      }, 1500)
    } else {
      setMessage("Unexpected payment status. Please contact support.")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6 uppercase">BILLING DETAILS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="firstName" className="block text-sm mb-1">
              First Name*
            </Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="block text-sm mb-1">
              Last Name*
            </Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mb-4">
          <Label htmlFor="country" className="block text-sm mb-1">
            Country*
          </Label>
          <Input
            type="text"
            id="country"
            name="country"
            required
            value={formData.country}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="address" className="block text-sm mb-1">
            Address*
          </Label>
          <Input
            type="text"
            id="address"
            name="address"
            placeholder="Street Address"
            className="mb-2"
            required
            value={formData.address}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            id="apartment"
            name="apartment"
            placeholder="Apartment, suite, unit etc (optional)"
            value={formData.apartment}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="city" className="block text-sm mb-1">
            Town/City*
          </Label>
          <Input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} />
        </div>

        <div className="mb-4">
          <Label htmlFor="state" className="block text-sm mb-1">
            Country/State*
          </Label>
          <Input type="text" id="state" name="state" required value={formData.state} onChange={handleInputChange} />
        </div>

        <div className="mb-4">
          <Label htmlFor="zipCode" className="block text-sm mb-1">
            Postcode / ZIP*
          </Label>
          <Input
            type="text"
            id="zipCode"
            name="zipCode"
            required
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="phone" className="block text-sm mb-1">
              Phone*
            </Label>
            <Input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm mb-1">
              Email*
            </Label>
            <Input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <Checkbox
              id="createAccount"
              name="createAccount"
              checked={formData.createAccount}
              onCheckedChange={(checked) => setFormData({ ...formData, createAccount: checked === true })}
            />
            <Label htmlFor="createAccount" className="ml-2 text-sm">
              Create an account?
            </Label>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Create an account by entering the information below. If you are a returning customer please login at the top
            of the page.
          </p>
        </div>

        {formData.createAccount && (
          <div className="mb-4">
            <Label htmlFor="password" className="block text-sm mb-1">
              Account Password*
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              required={formData.createAccount}
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
        )}

        <div className="mb-4">
          <Label htmlFor="orderNotes" className="block text-sm mb-1">
            Order notes (optional)
          </Label>
          <Textarea
            id="orderNotes"
            name="orderNotes"
            placeholder="Notes about your order, e.g. special notes for delivery."
            rows={4}
            value={formData.orderNotes}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm p-6 mb-8">
        <h2 className="text-lg font-bold mb-6 uppercase">PAYMENT METHOD</h2>

        <div className="mb-6">
          <PaymentElement />
        </div>

        {message && (
          <div
            className={`p-4 mb-6 rounded-md ${message.includes("successful") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {message}
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-black text-white text-center px-6 py-3 uppercase text-sm font-medium"
          disabled={!stripe || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "PLACE ORDER"
          )}
        </Button>
      </div>
    </form>
  )
}
