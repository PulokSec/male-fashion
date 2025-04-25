"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import TopBar from "@/components/top-bar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  const paymentIntent = searchParams.get("payment_intent")
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")

  useEffect(() => {
    if (paymentIntent) {
      // Verify the payment was successful
      fetch(`/api/verify-payment?paymentIntent=${paymentIntent}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setOrderDetails(data.order)
          } else {
            setError(data.error || "Failed to verify payment")
          }
        })
        .catch((err) => {
          console.error("Error verifying payment:", err)
          setError("An error occurred while verifying your payment")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [paymentIntent])

  return (
    <>
      <TopBar />
      <Header />
      <main className="bg-[#f8f7f3] py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-black" />
              <h1 className="text-2xl font-bold mb-2">Processing your order</h1>
              <p className="text-gray-600">Please wait while we confirm your payment...</p>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
                <h1 className="text-2xl font-bold mb-2">Payment Error</h1>
                <p>{error}</p>
              </div>
              <Link href="/cart">
                <Button className="bg-black text-white">Return to Cart</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="text-center mb-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-2">Thank You For Your Order!</h1>
                <p className="text-gray-600">Your order has been placed and is being processed.</p>
              </div>

              <div className="max-w-2xl mx-auto">
                <div className="border-b pb-4 mb-4">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <p className="mb-1">
                    <span className="font-medium">Order Number:</span> {orderDetails?._id || "N/A"}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Date:</span>{" "}
                    {orderDetails?.createdAt ? new Date(orderDetails.createdAt).toLocaleDateString() : "N/A"}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">Payment Method:</span> {orderDetails?.paymentMethod || "Credit Card"}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                  {orderDetails?.billingDetails ? (
                    <div>
                      <p className="mb-1">
                        {orderDetails.billingDetails.firstName} {orderDetails.billingDetails.lastName}
                      </p>
                      <p className="mb-1">{orderDetails.billingDetails.address}</p>
                      {orderDetails.billingDetails.apartment && (
                        <p className="mb-1">{orderDetails.billingDetails.apartment}</p>
                      )}
                      <p className="mb-1">
                        {orderDetails.billingDetails.city}, {orderDetails.billingDetails.state}{" "}
                        {orderDetails.billingDetails.zipCode}
                      </p>
                      <p className="mb-1">{orderDetails.billingDetails.country}</p>
                      <p className="mb-1">{orderDetails.billingDetails.email}</p>
                      <p className="mb-1">{orderDetails.billingDetails.phone}</p>
                    </div>
                  ) : (
                    <p>Shipping information not available</p>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  <Link href="/shop">
                    <Button className="bg-black text-white">Continue Shopping</Button>
                  </Link>
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
