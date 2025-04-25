"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Plus, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductImageUpload from "@/components/admin/product-image-upload"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [product, setProduct] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "",
    discountPercentage: "0",
    thumbnail: "",
    images: [] as string[],
    category: "",
    brand: "",
    tags: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    material: "",
    weight: "",
    dimensions: {
      width: "",
      height: "",
      depth: "",
    },
    warrantyInformation: "",
    shippingInformation: "",
    returnPolicy: "",
    availabilityStatus: "In Stock",
    minimumOrderQuantity: "1",
    careInstructions: "",
    isNew: false,
    isFeatured: false,
    isBestSeller: false,
    stock: "0",
    sku: "",
    meta: {
      barcode: "",
      qrCode: "",
    },
  })

  const [newTag, setNewTag] = useState("")
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")
  const [newImage, setNewImage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }))
  }

  const handleMetaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        [name]: value,
      },
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProduct((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const addTag = () => {
    if (newTag && !product.tags.includes(newTag)) {
      setProduct((prev) => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setProduct((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const addColor = () => {
    if (newColor && !product.colors.includes(newColor)) {
      setProduct((prev) => ({ ...prev, colors: [...prev.colors, newColor] }))
      setNewColor("")
    }
  }

  const removeColor = (color: string) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }))
  }

  const addSize = () => {
    if (newSize && !product.sizes.includes(newSize)) {
      setProduct((prev) => ({ ...prev, sizes: [...prev.sizes, newSize] }))
      setNewSize("")
    }
  }

  const removeSize = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }))
  }

  const addImage = () => {
    if (newImage && !product.images.includes(newImage)) {
      setProduct((prev) => ({ ...prev, images: [...prev.images, newImage] }))
      setNewImage("")
    }
  }

  const removeImage = (image: string) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== image),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Convert string values to appropriate types
      const formattedProduct = {
        ...product,
        price: Number.parseFloat(product.price),
        discountPercentage: Number.parseFloat(product.discountPercentage),
        stock: Number.parseInt(product.stock),
        minimumOrderQuantity: Number.parseInt(product.minimumOrderQuantity),
        weight: product.weight ? Number.parseFloat(product.weight) : undefined,
        dimensions: {
          width: product.dimensions.width ? Number.parseFloat(product.dimensions.width) : undefined,
          height: product.dimensions.height ? Number.parseFloat(product.dimensions.height) : undefined,
          depth: product.dimensions.depth ? Number.parseFloat(product.dimensions.depth) : undefined,
        },
      }

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedProduct),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create product")
      }

      router.push("/admin/products")
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Add New Product</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="attributes">Attributes</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="shipping">Shipping & Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={product.title}
                    onChange={handleChange}
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    name="shortDescription"
                    value={product.shortDescription}
                    onChange={handleChange}
                    placeholder="Brief product description"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    placeholder="Detailed product description"
                    rows={5}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={product.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                    <Input
                      id="discountPercentage"
                      name="discountPercentage"
                      type="number"
                      step="0.01"
                      value={product.discountPercentage}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={product.brand}
                      onChange={handleChange}
                      placeholder="Brand name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleSelectChange("category", value)} value={product.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="mens-shirts">Men's Shirts</SelectItem>
                        <SelectItem value="womens-dresses">Women's Dresses</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      name="sku"
                      value={product.sku}
                      onChange={handleChange}
                      placeholder="Stock Keeping Unit"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isNew"
                      checked={product.isNew}
                      onCheckedChange={(checked) => handleSwitchChange("isNew", checked)}
                    />
                    <Label htmlFor="isNew">New Product</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isFeatured"
                      checked={product.isFeatured}
                      onCheckedChange={(checked) => handleSwitchChange("isFeatured", checked)}
                    />
                    <Label htmlFor="isFeatured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isBestSeller"
                      checked={product.isBestSeller}
                      onCheckedChange={(checked) => handleSwitchChange("isBestSeller", checked)}
                    />
                    <Label htmlFor="isBestSeller">Best Seller</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Main Image (Thumbnail)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    value={product.thumbnail}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <ProductImageUpload
                  onImageUploaded={(url) => setProduct((prev) => ({ ...prev, thumbnail: url }))}
                  currentImage={product.thumbnail}
                  buttonText="Upload Thumbnail"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://example.com/gallery-image.jpg"
                  />
                  <Button onClick={addImage} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        onClick={() => removeImage(image)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attributes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add a color (e.g. Red, #FF0000)"
                  />
                  <Button onClick={addColor} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {product.colors.map((color) => (
                    <div key={color} className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1 text-sm">
                      <span>{color}</span>
                      <button onClick={() => removeColor(color)} className="ml-2 text-gray-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add a size (e.g. S, M, L, XL)"
                  />
                  <Button onClick={addSize} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {product.sizes.map((size) => (
                    <div key={size} className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1 text-sm">
                      <span>{size}</span>
                      <button onClick={() => removeSize(size)} className="ml-2 text-gray-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag (e.g. summer, casual)"
                  />
                  <Button onClick={addTag} type="button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {product.tags.map((tag) => (
                    <div key={tag} className="flex items-center bg-gray-100 rounded-full pl-3 pr-2 py-1 text-sm">
                      <span>{tag}</span>
                      <button onClick={() => removeTag(tag)} className="ml-2 text-gray-500 hover:text-red-500">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={product.material}
                    onChange={handleChange}
                    placeholder="e.g. 80% Cotton, 20% Polyester"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (g)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={product.weight}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="width" className="text-xs">
                        Width
                      </Label>
                      <Input
                        id="width"
                        name="width"
                        type="number"
                        step="0.01"
                        value={product.dimensions.width}
                        onChange={handleDimensionChange}
                        placeholder="Width"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs">
                        Height
                      </Label>
                      <Input
                        id="height"
                        name="height"
                        type="number"
                        step="0.01"
                        value={product.dimensions.height}
                        onChange={handleDimensionChange}
                        placeholder="Height"
                      />
                    </div>
                    <div>
                      <Label htmlFor="depth" className="text-xs">
                        Depth
                      </Label>
                      <Input
                        id="depth"
                        name="depth"
                        type="number"
                        step="0.01"
                        value={product.dimensions.depth}
                        onChange={handleDimensionChange}
                        placeholder="Depth"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="careInstructions">Care Instructions</Label>
                  <Textarea
                    id="careInstructions"
                    name="careInstructions"
                    value={product.careInstructions}
                    onChange={handleChange}
                    placeholder="e.g. Machine wash cold, tumble dry low"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warrantyInformation">Warranty Information</Label>
                  <Input
                    id="warrantyInformation"
                    name="warrantyInformation"
                    value={product.warrantyInformation}
                    onChange={handleChange}
                    placeholder="e.g. 1 year limited warranty"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                      id="barcode"
                      name="barcode"
                      value={product.meta.barcode}
                      onChange={handleMetaChange}
                      placeholder="e.g. 123456789012"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qrCode">QR Code URL</Label>
                    <Input
                      id="qrCode"
                      name="qrCode"
                      value={product.meta.qrCode}
                      onChange={handleMetaChange}
                      placeholder="https://example.com/qr-code.png"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={product.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity</Label>
                  <Input
                    id="minimumOrderQuantity"
                    name="minimumOrderQuantity"
                    type="number"
                    value={product.minimumOrderQuantity}
                    onChange={handleChange}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availabilityStatus">Availability Status</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("availabilityStatus", value)}
                    value={product.availabilityStatus}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="In Stock">In Stock</SelectItem>
                      <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                      <SelectItem value="Backordered">Backordered</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingInformation">Shipping Information</Label>
                  <Textarea
                    id="shippingInformation"
                    name="shippingInformation"
                    value={product.shippingInformation}
                    onChange={handleChange}
                    placeholder="e.g. Ships in 1-2 business days"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnPolicy">Return Policy</Label>
                  <Textarea
                    id="returnPolicy"
                    name="returnPolicy"
                    value={product.returnPolicy}
                    onChange={handleChange}
                    placeholder="e.g. 30-day return policy"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isLoading} className="w-full md:w-auto">
          {isLoading ? "Creating..." : "Create Product"}
        </Button>
      </div>
    </div>
  )
}
