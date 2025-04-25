"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function DealsPage() {
  const { toast } = useToast()
  const [deals, setDeals] = useState<{ _id: string; productId: string; startDate: string; endDate: string; isActive: boolean; discountPercentage: number; featured: boolean }[]>([])
  const [products, setProducts] = useState<{ [key: string]: any }>({})
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const now = new Date()

  // New deal form state
  const [selectedProduct, setSelectedProduct] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState("10")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) // 7 days from now
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch all deals
        const dealsResponse = await fetch("/api/deals")
        if (!dealsResponse.ok) throw new Error("Failed to fetch deals")
        const dealsData = await dealsResponse.json()
        setDeals(dealsData)

        // Fetch all products to get their details
        const productsResponse = await fetch("/api/products")
        if (!productsResponse.ok) throw new Error("Failed to fetch products")
        const productsData = await productsResponse.json()

        // Create a map of product IDs to product details
        const productMap: { [key: string]: typeof productsData.products[0] } = {}
        productsData.products.forEach((product: { _id: string | number }) => {
          productMap[product._id] = product
        })

        setProducts(productMap)
        setAllProducts(productsData.products)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load deals. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const calculateDiscountedPrice = (originalPrice: number, discountPercentage: number) => {
    return (originalPrice * (1 - discountPercentage / 100)).toFixed(2)
  }

  const isDealActive = (deal:any) => {
    const startDate = new Date(deal.startDate)
    const endDate = new Date(deal.endDate)
    return startDate <= now && endDate >= now && deal.isActive
  }

  const getDealStatus = (deal: any): { label: string; variant: "default" | "destructive" | "outline" | "secondary" | null | undefined; icon: React.ElementType } => {
    if (!deal.isActive) {
      return { label: "Inactive", variant: "outline", icon: XCircle }
    }

    const startDate = new Date(deal.startDate)
    const endDate = new Date(deal.endDate)

    if (startDate > now) {
      return { label: "Scheduled", variant: "secondary", icon: AlertCircle }
    } else if (endDate < now) {
      return { label: "Expired", variant: "destructive", icon: XCircle }
    } else {
      return { label: "Active", variant: "default", icon: CheckCircle }
    }
  }

  const handleCreateDeal = async () => {
    setFormError("")

    if (!selectedProduct) {
      setFormError("Please select a product")
      return
    }

    if (
      isNaN(Number.parseFloat(discountPercentage)) ||
      Number.parseFloat(discountPercentage) <= 0 ||
      Number.parseFloat(discountPercentage) > 99
    ) {
      setFormError("Discount percentage must be between 1 and 99")
      return
    }

    if (!startDate || !endDate) {
      setFormError("Please select start and end dates")
      return
    }

    if (startDate > endDate) {
      setFormError("End date must be after start date")
      return
    }

    try {
      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: selectedProduct,
          discountPercentage: Number.parseFloat(discountPercentage),
          startDate,
          endDate,
          isActive,
          featured: isFeatured,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create deal")
      }

      // Refresh deals list
      const dealsResponse = await fetch("/api/deals")
      const dealsData = await dealsResponse.json()
      setDeals(dealsData)

      // Reset form
      setSelectedProduct("")
      setDiscountPercentage("10")
      setStartDate(new Date())
      setEndDate(new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))
      setIsActive(true)
      setIsFeatured(false)

      // Close dialog
      setDialogOpen(false)

      toast({
        title: "Success",
        description: "Deal created successfully",
      })
    } catch (error) {
      console.error("Error creating deal:", error)
      setFormError((error as any).message || "Failed to create deal")
    }
  }

  // Filter out products that already have active deals
  const availableProducts = allProducts.filter((product: { _id: string }) => {
    const hasActiveDeal = deals.some((deal: { productId: string }) => deal.productId === product._id && isDealActive(deal))
    return !hasActiveDeal
  })

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Deals</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Original Price</TableHead>
                  <TableHead>Sale Price</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-6 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Deals</h1>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Quick Add Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Deal</DialogTitle>
              </DialogHeader>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <span className="block sm:inline">{formError}</span>
                </div>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="product" className="text-right">
                    Product
                  </Label>
                  <div className="col-span-3">
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProducts.length > 0 ? (
                          availableProducts.map((product: { _id: string; name?: string; title?: string }) => (
                            <SelectItem key={product._id} value={product._id}>
                              {product.name || product.title}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="none" disabled>
                            No available products
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="discount" className="text-right">
                    Discount %
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="discount"
                      type="number"
                      min="1"
                      max="99"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Start Date</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(day) => day && setStartDate(day)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">End Date</Label>
                  <div className="col-span-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={(day) => day && setEndDate(day)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3">
                    <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="featured" className="text-right">
                    Featured
                  </Label>
                  <div className="col-span-3">
                    <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateDeal}>Create Deal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Link href="/admin/deals/new">
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Advanced
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Original Price</TableHead>
                <TableHead>Sale Price</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.length > 0 ? (
                deals.map((deal) => {
                  const product = products[deal.productId]
                  const status = getDealStatus(deal)
                  const StatusIcon = status.icon

                  return (
                    <TableRow key={deal._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {product && product.image && (
                            <div className="w-8 h-8 rounded overflow-hidden bg-gray-100">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name || product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <span>{product ? product.name || product.title : "Unknown Product"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{deal.discountPercentage}%</TableCell>
                      <TableCell>${product ? product.price.toFixed(2) : "N/A"}</TableCell>
                      <TableCell>
                        ${product ? calculateDiscountedPrice(product.price, deal.discountPercentage) : "N/A"}
                      </TableCell>
                      <TableCell>{formatDate(deal.startDate)}</TableCell>
                      <TableCell>{formatDate(deal.endDate)}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="flex items-center w-fit gap-1">
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {deal.featured ? (
                          <Badge variant="secondary">Featured</Badge>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/admin/deals/edit/${deal._id}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Link href={`/admin/deals/delete/${deal._id}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                    No deals found. Click "Add Deal" to create your first promotional deal.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
