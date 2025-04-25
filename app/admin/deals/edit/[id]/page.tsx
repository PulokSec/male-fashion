"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { AlertCircle, CalendarIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"

export default function EditDealPage({ params }: { params: { id: string } }) {
  const {id} = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [products, setProducts] = useState<{ _id: string; title: string; price: number }[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  interface ProductDetails {
    title: string;
    price: number;
    images: string[];
  }
  
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null)
  const [discountPercentage, setDiscountPercentage] = useState(10)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 7)))
  const [featured, setFeatured] = useState(false)
  const [dealStatus, setDealStatus] = useState<"active" | "scheduled" | "expired">("active")
  const [originalPrice, setOriginalPrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)

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
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch products
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) throw new Error("Failed to fetch products")
        const productsData = await productsResponse.json()
        setProducts(productsData.products || [])

        // Fetch deal details
        const dealResponse = await fetch(`/api/deals/${id}`)
        if (!dealResponse.ok) throw new Error("Failed to fetch deal")
        const dealData = await dealResponse.json()

        // Set form values
        setSelectedProduct(dealData.productId)
        setDiscountPercentage(dealData.discountPercentage)
        setStartDate(new Date(dealData.startDate))
        setEndDate(new Date(dealData.endDate))
        setFeatured(dealData.featured || false)

        // Calculate status
        setDealStatus(calculateDealStatus(new Date(dealData.startDate), new Date(dealData.endDate)))

        // Fetch product details
        if (dealData.productId) {
          const productResponse = await fetch(`/api/products/${dealData.productId}`)
          if (productResponse.ok) {
            const productData = await productResponse.json()
            setProductDetails(productData.product)
            setOriginalPrice(productData.product.price)
            setSalePrice(calculateSalePrice(productData.product.price, dealData.discountPercentage))
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
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
      fetchData()
    }
  }, [id, toast])

  // Update product details when product selection changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!selectedProduct) {
        setProductDetails(null)
        setOriginalPrice(0)
        setSalePrice(0)
        return
      }

      try {
        const response = await fetch(`/api/products/${selectedProduct}`)
        if (response.ok) {
          const data = await response.json()
          setProductDetails(data.product)
          setOriginalPrice(data.product.price)
          setSalePrice(calculateSalePrice(data.product.price, discountPercentage))
        }
      } catch (error) {
        console.error("Error fetching product details:", error)
      }
    }

    fetchProductDetails()
  }, [selectedProduct])

  // Update sale price when discount changes
  useEffect(() => {
    if (originalPrice > 0) {
      setSalePrice(calculateSalePrice(originalPrice, discountPercentage))
    }
  }, [discountPercentage, originalPrice])

  // Update deal status when dates change
  useEffect(() => {
    if (startDate && endDate) {
      setDealStatus(calculateDealStatus(startDate, endDate))
    }
  }, [startDate, endDate])

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Please select a product for the deal",
        variant: "destructive",
      })
      return
    }

    if (discountPercentage <= 0 || discountPercentage > 99) {
      toast({
        title: "Error",
        description: "Discount percentage must be between 1 and 99",
        variant: "destructive",
      })
      return
    }

    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      })
      return
    }

    if (endDate <= startDate) {
      toast({
        title: "Error",
        description: "End date must be after start date",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      const dealData = {
        productId: selectedProduct,
        discountPercentage,
        startDate,
        endDate,
        featured,
      }

      const response = await fetch(`/api/deals/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dealData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update deal")
      }

      toast({
        title: "Success",
        description: "Deal updated successfully",
      })

      router.push("/admin/deals")
    } catch (error) {
      console.error("Error updating deal:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update deal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Deal</h1>
        <Button variant="outline" onClick={() => router.push("/admin/deals")}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deal Information</CardTitle>
          <CardDescription>Update the promotional deal details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {dealStatus === "expired" && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Deal Expired</AlertTitle>
                <AlertDescription>This deal has expired. Update the end date to reactivate it.</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger id="product" className="w-full">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <SelectItem key={product._id} value={product._id}>
                          {product.title} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-center text-sm text-gray-500">No products found</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

                          src={productDetails?.images?.[0] || "/placeholder.svg"}
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center gap-4">
                    {productDetails?.images && productDetails?.images[0] && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                        <Image
                          src={productDetails?.images?.[0] || "/placeholder.svg"}
                          alt={productDetails?.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium">{productDetails?.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-muted-foreground line-through">${originalPrice.toFixed(2)}</p>
                        <p className="text-primary font-bold">${salePrice.toFixed(2)}</p>
                        <Badge variant="outline" className="ml-auto">
                          {dealStatus === "active" && "Active"}
                          {dealStatus === "scheduled" && "Scheduled"}
                          {dealStatus === "expired" && "Expired"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

              <div>
                <Label htmlFor="discount">Discount Percentage (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="discount"
                    type="number"
                    min="1"
                    max="99"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                    required
                    className="flex-1"
                  />
                  <Badge variant="secondary" className="text-sm">
                    Save ${(originalPrice - salePrice).toFixed(2)}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="startDate">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal" id="endDate">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
                <Label htmlFor="featured">Featured on Homepage</Label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Deal...
                </>
              ) : (
                "Update Deal"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
