"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Loader2, Calendar, BadgePercent, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { format } from "date-fns"

export default function DeleteDealPage() {
  const {id} = useParams();
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  interface Deal {
    discountPercentage: number
    startDate: string
    endDate: string
    productId?: string
    featured: boolean
  }

  const [deal, setDeal] = useState<Deal | null>(null)
  interface Product {
    images: string[]
    title: string
    price: number
  }

  const [product, setProduct] = useState<Product | null>(null)
  const [dealStatus, setDealStatus] = useState<"active" | "scheduled" | "expired">("active")

  // Calculate deal status based on dates
  const calculateDealStatus = (start: Date, end: Date) => {
    const now = new Date()
    if (now < start) return "scheduled"
    if (now > end) return "expired"
    return "active"
  }

  // Calculate sale price
  const calculateSalePrice = (price: number, discount: number) => {
    return price - (price * discount) / 100
  }

  useEffect(() => {
    const fetchDeal = async () => {
      setLoading(true)
      try {
        // Fetch deal details
        const dealResponse = await fetch(`/api/deals/${id}`)
        if (!dealResponse.ok) throw new Error("Failed to fetch deal")
        const dealData = await dealResponse.json()
        setDeal(dealData)

        // Calculate status
        setDealStatus(calculateDealStatus(new Date(dealData.startDate), new Date(dealData.endDate)))

        // Fetch product details
        if (dealData.productId) {
          const productResponse = await fetch(`/api/products/${dealData.productId}`)
          if (productResponse.ok) {
            const productData = await productResponse.json()
            setProduct(productData.product)
          }
        }
      } catch (error) {
        console.error("Error fetching deal:", error)
        toast({
          title: "Error",
          description: "Failed to load deal information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchDeal()
    }
  }, [id, toast])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete deal")
      }

      toast({
        title: "Success",
        description: "Deal deleted successfully",
      })

      router.push("/admin/deals")
    } catch (error) {
      console.error("Error deleting deal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete deal. Please try again.",
        variant: "destructive",
      })
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading deal information...</p>
        </div>
      </div>
    )
  }

  if (!deal) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Deal Not Found</h1>
        <p className="mb-6">The deal you are trying to delete does not exist or has already been removed.</p>
        <Button onClick={() => router.push("/admin/deals")}>Return to Deals</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <Card className="border-destructive/20">
        <CardHeader className="bg-destructive/5 border-b border-destructive/20">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Delete Deal</CardTitle>
          </div>
          <CardDescription>You are about to delete a deal. This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {product && (
              <div className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg">
                {product?.images && product?.images[0] && (
                  <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                    <Image
                      src={product?.images[0] || "/placeholder.svg"}
                      alt={product?.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{product?.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                    <p className="text-primary font-bold">
                      ${calculateSalePrice(product?.price, deal?.discountPercentage).toFixed(2)}
                    </p>
                    <Badge
                      className="ml-auto"
                      variant={
                        dealStatus === "active" ? "default" : dealStatus === "scheduled" ? "outline" : "secondary"
                      }
                    >
                      {dealStatus === "active" && "Active"}
                      {dealStatus === "scheduled" && "Scheduled"}
                      {dealStatus === "expired" && "Expired"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                <BadgePercent className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Discount</p>
                  <p className="text-sm">{deal.discountPercentage}% off</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                <Star className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Featured</p>
                  <p className="text-sm">{deal.featured ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm">{format(new Date(deal.startDate), "PPP")}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-background rounded-md border">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm">{format(new Date(deal.endDate), "PPP")}</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-md p-4 text-amber-800">
              <p className="font-medium">Warning:</p>
              <p>
                Deleting this deal will remove it from your store immediately. Any active promotions using this deal
                will no longer be available to customers.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => router.push("/admin/deals")} disabled={deleting}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
            {deleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete Deal"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
