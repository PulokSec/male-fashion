"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

export default function ImportProductsPage() {
  const router = useRouter()
  const [jsonData, setJsonData] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [importStats, setImportStats] = useState<{
    total: number
    success: number
    failed: number
    errors: string[]
  } | null>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        setJsonData(content)
        // Validate JSON
        JSON.parse(content)
      } catch (err) {
        setError("Invalid JSON file. Please check the file format.")
        setJsonData("")
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setImportStats(null)

    try {
      // Validate JSON
      const products = JSON.parse(jsonData)

      if (!Array.isArray(products)) {
        throw new Error("JSON data must be an array of products")
      }

      // Send to API
      const response = await fetch("/api/products/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to import products")
      }

      setSuccess(`Successfully imported ${data.success} products.`)
      setImportStats({
        total: data.total,
        success: data.success,
        failed: data.failed,
        errors: data.errors || [],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearForm = () => {
    setJsonData("")
    setError(null)
    setSuccess(null)
    setImportStats(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Import Products</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Import Products from JSON</CardTitle>
          <CardDescription>
            Upload a JSON file or paste JSON data to bulk import products. The JSON should be an array of product
            objects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Upload JSON File</label>
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">JSON files only</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="application/json"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Or Paste JSON Data</label>
              <Textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder='[{"title": "Product 1", "price": 99.99, ...}]'
                rows={10}
                className="font-mono text-sm"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleClearForm} disabled={isLoading}>
                Clear
              </Button>
              <Button onClick={handleImport} disabled={isLoading || !jsonData}>
                {isLoading ? "Importing..." : "Import Products"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {importStats && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold">{importStats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-md text-center">
                  <p className="text-sm text-green-600">Successful</p>
                  <p className="text-2xl font-bold text-green-600">{importStats.success}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-md text-center">
                  <p className="text-sm text-red-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">{importStats.failed}</p>
                </div>
              </div>

              {importStats.errors.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Errors</h3>
                  <div className="bg-red-50 p-4 rounded-md max-h-60 overflow-auto">
                    <ul className="list-disc pl-5 space-y-1">
                      {importStats.errors.map((error, index) => (
                        <li key={index} className="text-sm text-red-600">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Link href="/admin/products">
                  <Button>Go to Products</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>JSON Format Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-xs">
            {JSON.stringify(
              [
                {
                  title: "Blue & Black Check Shirt",
                  description:
                    "The Blue & Black Check Shirt is a stylish and comfortable men's shirt featuring a classic check pattern.",
                  category: "mens-shirts",
                  price: 29.99,
                  discountPercentage: 1.41,
                  rating: 4.19,
                  stock: 44,
                  tags: ["clothing", "men's shirts"],
                  brand: "Fashion Trends",
                  sku: "6RJDTVCU",
                  weight: 6,
                  dimensions: {
                    width: 17.25,
                    height: 27.31,
                    depth: 20.88,
                  },
                  warrantyInformation: "No warranty",
                  shippingInformation: "Ships in 1 month",
                  availabilityStatus: "In Stock",
                  returnPolicy: "7 days return policy",
                  minimumOrderQuantity: 4,
                  meta: {
                    barcode: "8840720880947",
                    qrCode: "https://assets.dummyjson.com/public/qr-code.png",
                  },
                  images: [
                    "https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/1.png",
                    "https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/2.png",
                  ],
                  thumbnail:
                    "https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/thumbnail.png",
                },
              ],
              null,
              2,
            )}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}
