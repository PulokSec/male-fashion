import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { connectToDatabase } from "@/lib/mongoose"
import Order from "@/models/Order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paymentIntentId, billingDetails } = body

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Get payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    // Connect to database
    await connectToDatabase()

    // Create order in database
    const order = await Order.create({
      paymentIntentId,
      amount: paymentIntent.amount / 100, // Convert from cents to dollars
      status: paymentIntent.status,
      items: JSON.parse(paymentIntent.metadata.items || "[]"),
      billingDetails,
      paymentMethod: paymentIntent.payment_method_types[0],
    })

    return NextResponse.json({ success: true, orderId: order._id })
  } catch (error) {
    console.error("Error saving billing details:", error)
    return NextResponse.json({ error: "Failed to save billing details" }, { status: 500 })
  }
}
