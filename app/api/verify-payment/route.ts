import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { connectToDatabase } from "@/lib/mongoose"
import Order from "@/models/Order"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const paymentIntent = searchParams.get("paymentIntent")

    if (!paymentIntent) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Verify payment intent with Stripe
    const intent = await stripe.paymentIntents.retrieve(paymentIntent)

    if (intent.status !== "succeeded") {
      return NextResponse.json(
        { success: false, error: `Payment not successful. Status: ${intent.status}` },
        { status: 400 },
      )
    }

    // Get order details from database
    await connectToDatabase()
    const order = await Order.findOne({ paymentIntentId: paymentIntent })

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    // Update order status if needed
    if (order.status !== intent.status) {
      order.status = intent.status
      await order.save()
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ success: false, error: "Failed to verify payment" }, { status: 500 })
  }
}
